import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';


const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);


const sanitizeHtml = (htmlString) => {
  if (typeof htmlString !== 'string') {
    // Handle cases where input might not be a string (e.g., null, undefined)
    console.warn('sanitizeHtml: Input is not a string, returning empty string.');
    return '';
  }
  // Sanitize the HTML string to remove malicious content (XSS prevention)
  const cleanHtml = DOMPurify.sanitize(htmlString, {
    USE_PROFILES: { html: true },
  });
  return cleanHtml;
};

export default sanitizeHtml;