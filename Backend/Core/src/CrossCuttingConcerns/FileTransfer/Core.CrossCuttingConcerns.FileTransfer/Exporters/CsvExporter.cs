using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text;
using Core.CrossCuttingConcerns.FileTransfer.Abstraction;
using CsvHelper;
using CsvHelper.Configuration;

namespace Core.CrossCuttingConcerns.FileTransfer.Exporters;

public class CsvExporter : IFileExporter
{
    public byte[] ExportList<T>(IList<T> list)
    {
        using var memoryStream = new MemoryStream();
        using var writer = new StreamWriter(memoryStream, Encoding.UTF8);
        using var csv = new CsvWriter(writer, CultureInfo.InvariantCulture);

        csv.WriteRecords(list);
        writer.Flush();

        return memoryStream.ToArray();
    }

    public string GetContentType() => "text/csv";
    public string GetFileExtension() => ".csv";
}
