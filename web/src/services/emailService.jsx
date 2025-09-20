import emailjs from '@emailjs/browser';

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_8s0xtaf';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_hqhwz3i';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '9nQcHBHVrFwXK5t-0';

class EmailService {
	constructor() {
		try {
			emailjs.init(EMAILJS_PUBLIC_KEY);
			console.log('📧 EmailJS initialized');
		} catch (err) {
			console.error('Failed to initialize EmailJS', err);
		}
	}

	/**
	 * Sends receipt email to payer using EmailJS
	 * @param {Object} receipt - Receipt data including html, amount, date, etc.
	 * @param {string} payerEmail - Payer's email address
	 * @param {Object} options - Optional overrides (subject, supportContact, customerName)
	 * @returns {Promise<Object>} Email sending result
	 */
	async sendReceiptEmail(receipt, payerEmail, options = {}) {
		const {
			subject = 'Payment Receipt',
			supportContact = 'support@example.com',
			customerName = receipt?.customerName || receipt?.payerName || 'Customer'
		} = options;

		const amountFormatted = receipt?.amountFormatted || receipt?.amount_formatted || receipt?.amount || '';
		const dateFormatted = receipt?.dateFormatted || receipt?.date_formatted || receipt?.date || '';
		const receiptHtml = receipt?.html || receipt?.receipt_html || '';

		const templateParams = {
			to_email: payerEmail,
			subject,
			customer_name: customerName,
			amount_formatted: amountFormatted,
			date_formatted: dateFormatted,
			support_contact: supportContact,
			receipt_html: receiptHtml
		};

		try {
			const result = await emailjs.send(
				EMAILJS_SERVICE_ID,
				EMAILJS_TEMPLATE_ID,
				templateParams
			);

			return {
				success: true,
				messageId: result?.status ? `EMAILJS-${result.status}-${Date.now()}` : `EMAILJS-${Date.now()}`,
				provider: 'emailjs',
				response: result
			};
		} catch (error) {
			return {
				success: false,
				provider: 'emailjs',
				error: error?.text || error?.message || 'Unknown EmailJS error'
			};
		}
	}

	/**
	 * Sends a simple notification email using EmailJS
	 * Your EmailJS template must support these variables or use a separate template.
	 * @param {string} to - Recipient email
	 * @param {string} subject - Email subject
	 * @param {string} body - Email body (plain HTML)
	 */
	async sendNotificationEmail(to, subject, body) {
		const templateParams = {
			to_email: to,
			subject,
			customer_name: '',
			amount_formatted: '',
			date_formatted: '',
			support_contact: '',
			receipt_html: body
		};

		try {
			const result = await emailjs.send(
				EMAILJS_SERVICE_ID,
				EMAILJS_TEMPLATE_ID,
				templateParams
			);

			return {
				success: true,
				messageId: result?.status ? `EMAILJS-${result.status}-${Date.now()}` : `EMAILJS-${Date.now()}`,
				provider: 'emailjs',
				response: result
			};
		} catch (error) {
			return {
				success: false,
				provider: 'emailjs',
				error: error?.text || error?.message || 'Unknown EmailJS error'
			};
		}
	}

	/**
	 * Sends a test email
	 * @param {string} toEmail - Recipient email
	 */
	async sendTestEmail(toEmail) {
		return this.sendNotificationEmail(
			toEmail,
			'Test Email',
			'<p>This is a test email from EmailJS integration.</p>'
		);
	}
}

export const emailService = new EmailService();
export { EmailService };
