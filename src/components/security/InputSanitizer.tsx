
import DOMPurify from 'dompurify';

export const sanitizeInput = (input: string): string => {
  // Remove any HTML tags and sanitize
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  }).trim();
};

export const sanitizeHtml = (html: string): string => {
  // Allow safe HTML tags for rich content
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  });
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Basic international phone number validation
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const sanitizeFileName = (fileName: string): string => {
  // Remove dangerous characters from file names
  return fileName.replace(/[^a-zA-Z0-9\.\-_]/g, '').substring(0, 255);
};
