using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using Core.CrossCuttingConcerns.FileTransfer.Abstraction;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;

namespace Core.CrossCuttingConcerns.FileTransfer.Exporters;

public class ExcelExporter : IFileExporter
{
    public byte[] ExportList<T>(IList<T> list)
    {
        using var memoryStream = new MemoryStream();
        IWorkbook workbook = new XSSFWorkbook();
        ISheet sheet = workbook.CreateSheet(typeof(T).Name);

        // Header Row
        IRow headerRow = sheet.CreateRow(0);
        PropertyInfo[] properties = typeof(T).GetProperties();

        for (int i = 0; i < properties.Length; i++)
        {
            headerRow.CreateCell(i).SetCellValue(properties[i].Name);
        }

        // Data Rows
        for (int i = 0; i < list.Count; i++)
        {
            IRow row = sheet.CreateRow(i + 1);
            for (int j = 0; j < properties.Length; j++)
            {
                object? value = properties[j].GetValue(list[i]);
                row.CreateCell(j).SetCellValue(value?.ToString() ?? "");
            }
        }

        // Auto size columns
        for (int i = 0; i < properties.Length; i++)
        {
            sheet.AutoSizeColumn(i);
        }

        workbook.Write(memoryStream);
        return memoryStream.ToArray();
    }

    public string GetContentType() => "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    public string GetFileExtension() => ".xlsx";
}
