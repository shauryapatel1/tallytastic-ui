/**
 * URL validation utilities to prevent XSS and open redirect attacks
 */

// Allowed protocols for redirect URLs
const ALLOWED_PROTOCOLS = ['https:', 'http:'];

// Blocked patterns that could be used for XSS
const BLOCKED_PATTERNS = [
  /^javascript:/i,
  /^data:/i,
  /^vbscript:/i,
  /^file:/i,
  /^about:/i,
  /^blob:/i,
];

/**
 * Validates a redirect URL to prevent XSS and open redirect attacks
 * 
 * @param url - The URL to validate
 * @param options - Validation options
 * @returns Object with isValid flag and sanitized URL or error message
 */
export function validateRedirectUrl(
  url: string | undefined | null,
  options: {
    allowRelative?: boolean;
    allowedDomains?: string[];
    requireHttps?: boolean;
  } = {}
): { isValid: boolean; sanitizedUrl?: string; error?: string } {
  const { allowRelative = true, allowedDomains, requireHttps = false } = options;

  // Empty URL is valid (no redirect)
  if (!url || url.trim() === '') {
    return { isValid: true, sanitizedUrl: undefined };
  }

  const trimmedUrl = url.trim();

  // Check for blocked patterns (XSS vectors)
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmedUrl)) {
      return { isValid: false, error: 'URL contains potentially dangerous content' };
    }
  }

  // Check for relative URLs
  if (trimmedUrl.startsWith('/') && !trimmedUrl.startsWith('//')) {
    if (allowRelative) {
      // Validate it's a clean relative path
      if (/^\/[a-zA-Z0-9\-_\/\.\?\=\&\#\%]*$/.test(trimmedUrl)) {
        return { isValid: true, sanitizedUrl: trimmedUrl };
      }
      return { isValid: false, error: 'Invalid relative URL format' };
    }
    return { isValid: false, error: 'Relative URLs are not allowed' };
  }

  // Protocol-relative URLs are not allowed (can be used for attacks)
  if (trimmedUrl.startsWith('//')) {
    return { isValid: false, error: 'Protocol-relative URLs are not allowed' };
  }

  // Try to parse as absolute URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(trimmedUrl);
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }

  // Check protocol
  if (!ALLOWED_PROTOCOLS.includes(parsedUrl.protocol)) {
    return { isValid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
  }

  // Check for HTTPS requirement
  if (requireHttps && parsedUrl.protocol !== 'https:') {
    return { isValid: false, error: 'Only HTTPS URLs are allowed' };
  }

  // Check against allowed domains if specified
  if (allowedDomains && allowedDomains.length > 0) {
    const hostname = parsedUrl.hostname.toLowerCase();
    const isAllowed = allowedDomains.some(domain => {
      const normalizedDomain = domain.toLowerCase();
      // Exact match or subdomain match
      return hostname === normalizedDomain || 
             hostname.endsWith('.' + normalizedDomain);
    });

    if (!isAllowed) {
      return { isValid: false, error: 'URL domain is not in the allowed list' };
    }
  }

  // Additional safety checks
  // Prevent URLs with embedded credentials
  if (parsedUrl.username || parsedUrl.password) {
    return { isValid: false, error: 'URLs with embedded credentials are not allowed' };
  }

  // Return the sanitized URL (reconstructed from parsed URL for safety)
  return { 
    isValid: true, 
    sanitizedUrl: parsedUrl.toString() 
  };
}

/**
 * Validates a success redirect URL for form completion
 * More permissive than general redirect validation
 */
export function validateFormRedirectUrl(url: string | undefined | null): { 
  isValid: boolean; 
  sanitizedUrl?: string; 
  error?: string 
} {
  return validateRedirectUrl(url, {
    allowRelative: true,
    requireHttps: false, // Allow HTTP for development
  });
}

/**
 * Validates URLs that will be used in href attributes
 */
export function validateHrefUrl(url: string | undefined | null): {
  isValid: boolean;
  sanitizedUrl?: string;
  error?: string
} {
  if (!url || url.trim() === '') {
    return { isValid: true, sanitizedUrl: undefined };
  }

  const trimmedUrl = url.trim();

  // Check for dangerous protocols
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmedUrl)) {
      return { isValid: false, error: 'URL contains potentially dangerous content' };
    }
  }

  // Allow relative URLs, HTTP, HTTPS, mailto, and tel
  if (
    trimmedUrl.startsWith('/') ||
    trimmedUrl.startsWith('https://') ||
    trimmedUrl.startsWith('http://') ||
    trimmedUrl.startsWith('mailto:') ||
    trimmedUrl.startsWith('tel:')
  ) {
    return { isValid: true, sanitizedUrl: trimmedUrl };
  }

  return { isValid: false, error: 'Invalid URL format' };
}
