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
  // Helper function to compress image for upload (especially important for mobile)
  async compressImageFile(file: File, maxSizeMB: number = 2): Promise<File> {
    // If file is already small enough, return as-is
    if (file.size <= maxSizeMB * 1024 * 1024) {
      return file;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1920;
          
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = (height * MAX_WIDTH) / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = (width * MAX_HEIGHT) / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          
          // Try different quality levels until file size is acceptable
          let quality = 0.9;
          const tryCompress = () => {
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Failed to compress image'));
                  return;
                }

                const compressedFile = new File(
                  [blob],
                  file.name.replace(/\.[^/.]+$/, '') + '.jpg',
                  { type: 'image/jpeg', lastModified: Date.now() }
                );

                // If still too large and quality can be reduced, try again
                if (compressedFile.size > maxSizeMB * 1024 * 1024 && quality > 0.5) {
                  quality -= 0.1;
                  tryCompress();
                } else {
                  resolve(compressedFile);
                }
              },
              'image/jpeg',
              quality
            );
          };

          tryCompress();
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },

  async uploadClaimPhoto(file: File, claimNumber: string, photoType: string, additionalMetadata?: any): Promise<{ url: string | null; error: any }> {
    try {
      // Validate file
      if (!file || !(file instanceof File)) {
        throw new Error('Invalid file provided');
      }

      if (file.size === 0) {
        throw new Error('File is empty');
      }

      // Compress large files (especially important for mobile)
      let fileToUpload = file;
      if (file.size > 2 * 1024 * 1024) { // Larger than 2MB
        console.log(`Compressing ${photoType} photo (${(file.size / 1024 / 1024).toFixed(2)}MB)...`);
        try {
          fileToUpload = await this.compressImageFile(file, 2);
          console.log(`Compressed to ${(fileToUpload.size / 1024 / 1024).toFixed(2)}MB`);
        } catch (compressError) {
          console.warn('Compression failed, uploading original:', compressError);
          // Continue with original file if compression fails
        }
      }

      // Create a unique filename with timestamp to prevent overwrites
      const timestamp = Date.now();
      const fileExt = fileToUpload.name ? fileToUpload.name.split('.').pop() : 'jpg';
      // Sanitize the filename to remove any special characters
      const safePhotoType = photoType.replace(/[^a-zA-Z0-9-_]/g, '');
      const safeClaimNumber = claimNumber.replace(/[^a-zA-Z0-9-_]/g, '');
      const fileName = `${safePhotoType}-${timestamp}.${fileExt}`;
      const filePath = `${safeClaimNumber}/${fileName}`;

      // Add metadata for audit trail (but keep it minimal to avoid "Load failed" errors)
      const metadata = {
        claimNumber: safeClaimNumber,
        photoType: safePhotoType,
        originalName: file.name || fileName,
        uploadTime: new Date().toISOString(),
        fileSize: fileToUpload.size.toString(),
        mimeType: fileToUpload.type || 'image/jpeg',
        // Don't include large metadata that might cause issues
        ...(additionalMetadata && typeof additionalMetadata === 'object' ? {
          captureTime: additionalMetadata.captureTime,
          photoType: additionalMetadata.photoType
        } : {})
      };

      console.log(`Uploading ${photoType} photo to ${filePath} (${(fileToUpload.size / 1024).toFixed(2)}KB)...`);

      // Upload with retry logic for network failures
      let data, error;
      const maxRetries = 3;
      let retryCount = 0;

      while (retryCount < maxRetries) {
        const result = await supabase.storage
          .from('claim-photos')
          .upload(filePath, fileToUpload, {
            cacheControl: '3600',
            upsert: false,
            contentType: fileToUpload.type || 'image/jpeg',
            metadata: metadata
          });

        data = result.data;
        error = result.error;

        if (!error) {
          break; // Success!
        }

        // If error is not retryable (like file already exists), break immediately
        if (error.message?.includes('already exists') || error.message?.includes('duplicate')) {
          break;
        }

        retryCount++;
        if (retryCount < maxRetries) {
          console.warn(`Upload attempt ${retryCount} failed, retrying... (${retryCount}/${maxRetries})`);
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        }
      }

      if (error) {
        console.error('Upload error details after retries:', error);
        // Provide more helpful error message
        const errorMessage = error.message || JSON.stringify(error);
        if (errorMessage.includes('Load failed') || errorMessage.includes('network')) {
          throw new Error(`Network error uploading photo. Please check your internet connection and try again.`);
        }
        throw error;
      }

      console.log('Upload successful, data:', data);

      // Note: We skip verification listing as it can fail due to timing/caching
      // The upload success (data returned without error) is sufficient verification
      // If there was an error, it would have been thrown above
      
      // Optional: Try to verify file exists (with timeout and retry)
      // But don't fail if verification fails - upload success is primary indicator
      try {
        // Small delay to allow storage to propagate
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const { data: verifyData } = await supabase.storage
          .from('claim-photos')
          .list(safeClaimNumber, {
            limit: 1000
          });

        const fileExists = verifyData?.some(file => file.name === fileName);
        
        if (fileExists) {
          console.log(`✓ Verified: ${fileName} exists in storage`);
        } else {
          console.warn(`⚠ Verification: ${fileName} not immediately visible (may be caching issue)`);
          // Don't throw - upload was successful, this is just verification
        }
      } catch (verifyError) {
        console.warn('Verification check failed (non-critical):', verifyError);
        // Don't throw - upload was successful
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('claim-photos')
        .getPublicUrl(filePath);

      // Log successful upload for audit
      console.log('Photo uploaded successfully:', {
        claimNumber,
        photoType,
        filePath,
        publicUrl,
        fileSize: (fileToUpload.size / 1024).toFixed(2) + 'KB',
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

  // Get full photo URL (ensures URL is complete and accessible)
  getPhotoUrl(photoUrl: string | null | undefined): string {
    if (!photoUrl) return '';
    
    // If already a full URL, return as-is
    if (photoUrl.startsWith('http://') || photoUrl.startsWith('https://')) {
      return photoUrl;
    }
    
    // If it's a path, construct full Supabase public URL
    const cleanPath = photoUrl.startsWith('/') ? photoUrl.slice(1) : photoUrl;
    const { data } = supabase.storage
      .from('claim-photos')
      .getPublicUrl(cleanPath);
    
    return data.publicUrl;
  },

  // Note: Supabase Storage doesn't support server-side image transformation
  // For prototype, we'll use full URLs and rely on browser optimization
  // In production, you'd want to use a CDN with image optimization
  getThumbnailUrl(photoUrl: string): string {
    // For now, return the full URL - browser will handle sizing
    return this.getPhotoUrl(photoUrl);
  },

  // Get display URL for viewing
  getDisplayUrl(photoUrl: string): string {
    // Return full URL - images are already compressed during upload
    return this.getPhotoUrl(photoUrl);
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
