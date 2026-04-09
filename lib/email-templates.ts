import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

export async function buildEmailPayload(
  title: string,
  contentHtml: string,
): Promise<{ html: string; attachments: any[] }> {
  const attachments: any[] = [];

  // Try to load the logo
  let logoSrc = "";
  try {
    const logoPath = path.join(
      process.cwd(),
      "public",
      "Hason-Industries-Logo.png",
    );
    if (fs.existsSync(logoPath)) {
      attachments.push({
        filename: "Hason-Industries-Logo.png",
        path: logoPath,
        cid: "hason-logo",
      });
      logoSrc = "cid:hason-logo";
    }
  } catch (e) {
    console.warn("Could not load logo for email template.");
  }

  // Parse HTML to extract Base64 inline images created by ReactQuill
  const $ = cheerio.load(contentHtml);
  $("img").each((i, el) => {
    const src = $(el).attr("src");
    if (src && src.startsWith("data:image/")) {
      const matches = src.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1];
        const data = matches[2];
        const cid = `embedded-image-${i}.${ext}`;

        attachments.push({
          filename: `attachment-${i}.${ext}`,
          content: Buffer.from(data, "base64"),
          cid: cid,
        });

        // Mutate the HTML to point to the CID
        $(el).attr("src", `cid:${cid}`);
      }
    }
  });

  const parsedContent = $.html();

  const finalHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
      <style>
        body { margin: 0; padding: 0; background-color: #FAFAFA; font-family: 'Inter', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #FAFAFA; padding: 60px 0; }
        .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 640px; border-radius: 8px; border: 1px solid #e4e4e7; border-top: 4px solid #10B981; overflow: hidden; }
        .header { background-color: #ffffff; padding: 40px 40px 30px 40px; text-align: left; border-bottom: 1px solid #f4f4f5; }
        ${logoSrc ? "" : `.brand-text { font-family: 'Bebas Neue', Arial, sans-serif; font-size: 38px; color: #09090B; letter-spacing: 4px; margin: 0; }`}
        .title { font-family: 'Inter', Helvetica, sans-serif; font-size: 24px; color: #09090B; font-weight: 600; margin: 0 0 24px 0; letter-spacing: -0.5px; }
        .title-accent { color: #10B981; }
        .content { padding: 40px; color: #3f3f46; line-height: 1.6; font-size: 15px; }
        .content p { margin: 0 0 20px 0; }
        .content strong { color: #18181b; font-weight: 600; }
        .content img { max-width: 100%; height: auto; border-radius: 6px; border: 1px solid #e4e4e7; margin: 24px 0; display: block; }
        .content a { color: #10B981; text-decoration: none; font-weight: 500; }
        .content hr { border: 0; border-top: 1px solid #e4e4e7; margin: 32px 0; }
        .footer { background-color: #fafafa; border-top: 1px solid #e4e4e7; padding: 32px 40px; color: #71717a; font-family: 'Inter', Helvetica, sans-serif; font-size: 12px; line-height: 1.5; text-align: center; }
        .footer-utility { margin-bottom: 16px; font-family: 'DM Mono', Courier, monospace; text-transform: uppercase; letter-spacing: 1px; color: #a1a1aa; font-size: 10px; }
        .highlight { color: #10B981; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <table class="main" width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td class="header">
              ${logoSrc ? `<img src="${logoSrc}" alt="Hason Industries" style="max-height: 36px; width: auto; display: block;" />` : `<h1 class="brand-text">HASON<span class="highlight">.</span></h1>`}
            </td>
          </tr>
          <tr>
            <td class="content">
              <h2 class="title"><span class="title-accent">//</span> ${title}</h2>
              ${parsedContent}
            </td>
          </tr>
          <tr>
            <td class="footer">
              <div class="footer-utility">Official Hason Communication</div>
              <p style="margin: 0 0 8px 0;">This email is intended solely for the use of the individual or entity to whom it is addressed. If you have received this email in error, please notify the sender immediately.</p>
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} <strong>Hason Industries</strong>. All Rights Reserved. &middot; <a href="https://hason.com" style="color: #71717a; text-decoration: underline;">hason.com</a></p>
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;

  return { html: finalHtml, attachments };
}
