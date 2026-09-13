import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { createClient } from '@/lib/supabase/server';

const ACADEMY_NAME = 'Saima Perveen English Academy';
const TEACHER_NAME = 'Saima Perveen';

export async function GET(request: NextRequest, { params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = await paramsPromise;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // RLS (certificates_self) already restricts this to the owner or an admin,
  // but this also lets the query 404 cleanly for anything else.
  const { data: certificate } = await supabase
    .from('certificates')
    .select('id, certificate_code, issued_at, student:profiles(full_name), course:courses(title)')
    .eq('id', params.id)
    .single();

  if (!certificate) {
    return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
  }

  const studentName = (certificate.student as any)?.full_name || 'Student';
  const courseTitle = (certificate.course as any)?.title || 'Course';
  const issuedDate = new Date(certificate.issued_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const pdfBytes = await buildCertificatePdf({
    studentName,
    courseTitle,
    issuedDate,
    certificateCode: certificate.certificate_code,
    verifyUrl: `${request.nextUrl.origin}/verify/${certificate.certificate_code}`
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${certificate.certificate_code}.pdf"`
    }
  });
}

async function buildCertificatePdf({
  studentName,
  courseTitle,
  issuedDate,
  certificateCode,
  verifyUrl
}: {
  studentName: string;
  courseTitle: string;
  issuedDate: string;
  certificateCode: string;
  verifyUrl: string;
}) {
  const doc = await PDFDocument.create();
  // Landscape US Letter
  const page = doc.addPage([792, 612]);
  const { width, height } = page.getSize();

  const serifBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const serif = await doc.embedFont(StandardFonts.TimesRoman);
  const serifItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);

  const ink = rgb(0.106, 0.164, 0.29); // matches the site's --ink navy
  const gold = rgb(0.788, 0.635, 0.294);
  const inkFaded = rgb(0.106, 0.164, 0.29);

  // Outer border
  page.drawRectangle({
    x: 24,
    y: 24,
    width: width - 48,
    height: height - 48,
    borderColor: ink,
    borderWidth: 2
  });
  // Inner gold accent line
  page.drawRectangle({
    x: 36,
    y: 36,
    width: width - 72,
    height: height - 72,
    borderColor: gold,
    borderWidth: 1
  });

  const centerText = (text: string, y: number, font = serif, size = 14, color = ink) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (width - textWidth) / 2, y, size, font, color });
  };

  centerText(ACADEMY_NAME.toUpperCase(), height - 90, serifBold, 16, gold);
  centerText('Certificate of Completion', height - 150, serifBold, 34, ink);

  centerText('This certifies that', height - 205, serifItalic, 14, inkFaded);
  centerText(studentName, height - 250, serifBold, 28, ink);

  centerText('has successfully completed the course', height - 290, serifItalic, 14, inkFaded);
  centerText(courseTitle, height - 325, serifBold, 20, ink);

  centerText(`Issued on ${issuedDate}`, height - 370, serif, 12, inkFaded);

  // Signature line
  const sigY = 130;
  page.drawLine({
    start: { x: width / 2 - 110, y: sigY },
    end: { x: width / 2 + 110, y: sigY },
    thickness: 1,
    color: ink
  });
  centerText(TEACHER_NAME, sigY - 20, serifBold, 13, ink);
  centerText('Founder & Lead Instructor, ' + ACADEMY_NAME, sigY - 38, serif, 10, inkFaded);

  // Certificate ID, bottom corner
  page.drawText(`Certificate ID: ${certificateCode}`, {
    x: 50,
    y: 50,
    size: 9,
    font: serif,
    color: inkFaded
  });
  const verifyText = verifyUrl;
  const verifyWidth = serif.widthOfTextAtSize(verifyText, 9);
  page.drawText(verifyText, {
    x: width - 50 - verifyWidth,
    y: 50,
    size: 9,
    font: serif,
    color: inkFaded
  });

  return doc.save();
}
