using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using Core.CrossCuttingConcerns.FileTransfer.Abstraction;

namespace Core.CrossCuttingConcerns.FileTransfer.Exporters;

public class MarkdownExporter : IFileExporter
{
    public byte[] ExportList<T>(IList<T> list)
    {
        var sb = new StringBuilder();
        PropertyInfo[] properties = typeof(T).GetProperties();

        // Header
        sb.Append("| ");
        foreach (var prop in properties)
        {
            sb.Append(prop.Name).Append(" | ");
        }
        sb.AppendLine();

        // Separator
        sb.Append("| ");
        foreach (var prop in properties)
        {
            sb.Append("--- | ");
        }
        sb.AppendLine();

        // Data
        foreach (var item in list)
        {
            sb.Append("| ");
            foreach (var prop in properties)
            {
                var val = prop.GetValue(item)?.ToString() ?? "";
                // Escape pipes
                val = val.Replace("|", "\\|");
                sb.Append(val).Append(" | ");
            }
            sb.AppendLine();
        }

        return Encoding.UTF8.GetBytes(sb.ToString());
    }

    public string GetContentType() => "text/markdown";
    public string GetFileExtension() => ".md";
}
