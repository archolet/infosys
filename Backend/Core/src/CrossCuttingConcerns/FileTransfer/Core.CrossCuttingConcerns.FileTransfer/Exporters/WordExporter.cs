using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using Core.CrossCuttingConcerns.FileTransfer.Abstraction;
using NPOI.XWPF.UserModel;

namespace Core.CrossCuttingConcerns.FileTransfer.Exporters;

public class WordExporter : IFileExporter
{
    public byte[] ExportList<T>(IList<T> list)
    {
        using var memoryStream = new MemoryStream();
        XWPFDocument document = new XWPFDocument();

        // Create Table
        XWPFTable table = document.CreateTable();

        PropertyInfo[] properties = typeof(T).GetProperties();

        // Header Row
        XWPFTableRow headerRow = table.GetRow(0); // First row already exists
        headerRow.GetCell(0).SetText(properties[0].Name);

        for (int i = 1; i < properties.Length; i++)
        {
            headerRow.AddNewTableCell().SetText(properties[i].Name);
        }

        // Data Rows
        foreach (var item in list)
        {
            XWPFTableRow row = table.CreateRow();

            for (int i = 0; i < properties.Length; i++)
            {
                var val = properties[i].GetValue(item)?.ToString() ?? "";
                row.GetCell(i).SetText(val);
            }
        }

        document.Write(memoryStream);
        return memoryStream.ToArray();
    }

    public string GetContentType() => "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    public string GetFileExtension() => ".docx";
}
