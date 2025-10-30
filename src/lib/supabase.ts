import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://msjsvwidlmozchljtjag.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zanN2d2lkbG1vemNobGp0amFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0OTEwMjcsImV4cCI6MjA3NzA2NzAyN30.CGz4ZyRLCeoO1rbho_loOha0hr9OkDa79KVKa4AuCLc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Claim {
  id: string;
  created_at: string;
  updated_at: string;
  claim_number: string;
  user_name: string;
  user_email?: string;
  policy_number: string;
  contact_email: string;
  contact_phone: string;
  accident_datetime: string;
  submission_datetime: string;
  vehicle_plate: string;
  vehicle_make: string;
  vehicle_model: string;
  accident_description: string;
  photo_urls: string[];
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  claim_type?: string;
  claim_amount?: number;
}

export const claimsService = {
  async getUserClaims(userName: string) {
    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('user_name', userName)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async getClaimStats(userName?: string) {
    let query = supabase.from('claims').select('status');
    
    if (userName) {
      query = query.eq('user_name', userName);
    }
    
    const { data, error } = await query;
    
    if (error) return { error };
    
    const stats = {
      total: data.length,
      pending: data.filter(c => c.status === 'pending').length,
      approved: data.filter(c => c.status === 'approved').length,
      rejected: data.filter(c => c.status === 'rejected').length
    };
    
    return { data: stats, error: null };
  },

  async getAllClaims() {
    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  async updateClaimStatus(claimId: string, status: 'pending' | 'approved' | 'rejected', adminNotes?: string) {
    const updates: any = { status, updated_at: new Date().toISOString() };
    if (adminNotes !== undefined) updates.admin_notes = adminNotes;
    
    const { data, error } = await supabase
      .from('claims')
      .update(updates)
      .eq('claim_number', claimId)
      .select();
    
    return { data, error };
  },
  
  async getClaimByNumber(claimNumber: string) {
    const { data, error } = await supabase
      .from('claims')
      .select('*')
      .eq('claim_number', claimNumber)
      .single();
    
    return { data, error };
  }
};

export const storageService = {
  async uploadClaimPhoto(file: File, claimNumber: string, photoType: string): Promise<{ url: string | null; error: any }> {
    try {
      // Create a unique filename with timestamp to prevent overwrites
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${photoType}-${timestamp}.${fileExt}`;
      const filePath = `${claimNumber}/${fileName}`;

      // Add metadata for audit trail
      const metadata = {
        claimNumber,
        photoType,
        originalName: file.name,
        uploadTime: new Date().toISOString(),
        fileSize: file.size.toString(),
        mimeType: file.type,
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server'
      };

      // Upload to Supabase Storage with metadata
      const { error } = await supabase.storage
        .from('claim-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          metadata
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('claim-photos')
        .getPublicUrl(filePath);

      // Log successful upload for audit
      console.log('Photo uploaded:', {
        claimNumber,
        photoType,
        filePath,
        timestamp: new Date().toISOString()
      });

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading photo:', error);
      return { url: null, error };
    }
  },

  async uploadMultiplePhotos(photos: { [key: string]: File }, claimNumber: string): Promise<{ urls: string[]; errors: any[] }> {
    const uploadPromises = Object.entries(photos).map(async ([photoType, file]) => {
      const result = await this.uploadClaimPhoto(file, claimNumber, photoType);
      return { photoType, ...result };
    });

    const results = await Promise.all(uploadPromises);
    const urls = results.filter(r => r.url).map(r => r.url as string);
    const errors = results.filter(r => r.error).map(r => ({ photoType: r.photoType, error: r.error }));

    return { urls, errors };
  },

  async deleteClaimPhotos(claimNumber: string) {
    try {
      // List all files in the claim folder
      const { data: files, error: listError } = await supabase.storage
        .from('claim-photos')
        .list(claimNumber);

      if (listError) throw listError;

      if (files && files.length > 0) {
        // Delete all files
        const filePaths = files.map(file => `${claimNumber}/${file.name}`);
        const { error: deleteError } = await supabase.storage
          .from('claim-photos')
          .remove(filePaths);

        if (deleteError) throw deleteError;
      }

      return { success: true, error: null };
    } catch (error) {
      console.error('Error deleting photos:', error);
      return { success: false, error };
    }
  },

  // Method to verify photo authenticity and retrieve metadata (for admin use)
  async getPhotoMetadata(claimNumber: string) {
    try {
      const { data: files, error } = await supabase.storage
        .from('claim-photos')
        .list(claimNumber, {
          limit: 100,
          offset: 0
        });

      if (error) throw error;

      // Get metadata for each file
      const fileDetails = files?.map(file => ({
        name: file.name,
        size: file.metadata?.size,
        uploadTime: file.created_at,
        lastModified: file.updated_at,
        metadata: file.metadata
      })) || [];

      return { data: fileDetails, error: null };
    } catch (error) {
      console.error('Error fetching photo metadata:', error);
      return { data: null, error };
    }
  }
};
