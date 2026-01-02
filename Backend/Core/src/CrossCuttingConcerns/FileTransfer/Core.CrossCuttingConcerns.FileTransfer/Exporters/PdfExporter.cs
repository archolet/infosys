using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using Core.CrossCuttingConcerns.FileTransfer.Abstraction;
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;

namespace Core.CrossCuttingConcerns.FileTransfer.Exporters;

public class PdfExporter : IFileExporter
{
    public byte[] ExportList<T>(IList<T> list)
    {
        using var memoryStream = new MemoryStream();
        var document = new PdfDocument();
        var page = document.AddPage();
        var gfx = XGraphics.FromPdfPage(page);
        var font = new XFont("Arial", 10, XFontStyle.Regular);
        var headerFont = new XFont("Arial", 12, XFontStyle.Bold);

        int yPoint = 40;
        int xPoint = 40;
        int rowHeight = 20;

        PropertyInfo[] properties = typeof(T).GetProperties();

        // Simple Table Implementation
        // Header
        string headerLine = string.Join(" | ", properties.Select(p => p.Name));
        gfx.DrawString(headerLine, headerFont, XBrushes.Black, new XRect(xPoint, yPoint, page.Width, page.Height), XStringFormats.TopLeft);
        yPoint += rowHeight + 10;

        // Rows
        foreach (var item in list)
        {
            var values = properties.Select(p => p.GetValue(item)?.ToString() ?? "");
            string line = string.Join(" | ", values);

            // Check page break
            if (yPoint > page.Height - 50)
            {
                page = document.AddPage();
                gfx = XGraphics.FromPdfPage(page);
                yPoint = 40;
            }

            gfx.DrawString(line, font, XBrushes.Black, new XRect(xPoint, yPoint, page.Width, page.Height), XStringFormats.TopLeft);
            yPoint += rowHeight;
        }

        document.Save(memoryStream);
        return memoryStream.ToArray();
    }

    public string GetContentType() => "application/pdf";
    public string GetFileExtension() => ".pdf";
}
