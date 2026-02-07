import jsPDF from 'jspdf';

export const generateCertificate = (userName, courseTitle, completionDate) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    // Certificate Design Constants
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Background
    doc.setFillColor(26, 26, 46); // Dark blue theme
    doc.rect(0, 0, width, height, 'F');

    // Stylish Border
    doc.setDrawColor(102, 126, 234); // Primary theme color
    doc.setLineWidth(5);
    doc.rect(10, 10, width - 20, height - 20);

    doc.setDrawColor(118, 75, 162); // Secondary theme color
    doc.setLineWidth(2);
    doc.rect(15, 15, width - 30, height - 30);

    // Logo Placeholder / Icon
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(40);
    doc.text('ELITE REGISTRY', width / 2, 45, { align: 'center' });

    // Certificate Header
    doc.setFontSize(25);
    doc.setFont('helvetica', 'normal');
    doc.text('CERTIFICATE OF ACHIEVEMENT', width / 2, 80, { align: 'center' });

    // Subtext
    doc.setFontSize(15);
    doc.text('This is to certify that', width / 2, 100, { align: 'center' });

    // User Name
    doc.setTextColor(102, 126, 234);
    doc.setFontSize(35);
    doc.setFont('helvetica', 'bold');
    doc.text(userName.toUpperCase(), width / 2, 120, { align: 'center' });

    // Course Text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'normal');
    doc.text('has successfully completed the course', width / 2, 140, { align: 'center' });

    // Course Title
    doc.setTextColor(118, 75, 162);
    doc.setFontSize(25);
    doc.setFont('helvetica', 'bold');
    doc.text(courseTitle, width / 2, 155, { align: 'center' });

    // Date and Signatures
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date(completionDate).toLocaleDateString()}`, 40, 185);

    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(width - 40, 180, width - 100, 180);
    doc.text('Director Signature', width - 70, 185, { align: 'center' });

    // Footer Tagline
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('Empowering the Next Generation of Tech Leaders', width / 2, height - 15, { align: 'center' });

    // Save the PDF
    doc.save(`${userName.replace(/\s+/g, '_')}_${courseTitle.replace(/\s+/g, '_')}_Certificate.pdf`);
};
