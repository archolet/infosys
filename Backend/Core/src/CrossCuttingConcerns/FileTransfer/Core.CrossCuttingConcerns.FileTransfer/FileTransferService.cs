using System;
using System.Collections.Generic;
using Core.CrossCuttingConcerns.FileTransfer.Abstraction;
using Core.CrossCuttingConcerns.FileTransfer.Exporters;

namespace Core.CrossCuttingConcerns.FileTransfer;

public class FileTransferService : IFileTransferService
{
    private readonly Dictionary<FileTransferType, IFileExporter> _exporters;

    public FileTransferService()
    {
        _exporters = new Dictionary<FileTransferType, IFileExporter>
        {
            { FileTransferType.Excel, new ExcelExporter() },
            { FileTransferType.Csv, new CsvExporter() },
            { FileTransferType.Pdf, new PdfExporter() },
            { FileTransferType.Word, new WordExporter() },
            { FileTransferType.Markdown, new MarkdownExporter() }
        };
    }

    public byte[] Export<T>(IList<T> list, FileTransferType type)
    {
        if (_exporters.TryGetValue(type, out var exporter))
        {
            return exporter.ExportList(list);
        }
        throw new NotSupportedException($"Export type {type} is not supported.");
    }

    public string GetContentType(FileTransferType type)
    {
        if (_exporters.TryGetValue(type, out var exporter))
        {
            return exporter.GetContentType();
        }
        return "application/octet-stream";
    }

    public string GetFileExtension(FileTransferType type)
    {
        if (_exporters.TryGetValue(type, out var exporter))
        {
            return exporter.GetFileExtension();
        }
        return "";
    }
}
