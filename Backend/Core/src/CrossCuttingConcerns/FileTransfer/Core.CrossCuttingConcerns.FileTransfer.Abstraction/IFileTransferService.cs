using System.Collections.Generic;
using System.IO;

namespace Core.CrossCuttingConcerns.FileTransfer.Abstraction;

public interface IFileExporter
{
    byte[] ExportList<T>(IList<T> list);
    string GetContentType();
    string GetFileExtension();
}

public interface IFileImporter
{
    IList<T> ImportList<T>(Stream stream);
}

public enum FileTransferType
{
    Excel,
    Csv,
    Pdf,
    Word,
    Markdown
}

public interface IFileTransferService
{
    byte[] Export<T>(IList<T> list, FileTransferType type);
    string GetContentType(FileTransferType type);
    string GetFileExtension(FileTransferType type);
}
