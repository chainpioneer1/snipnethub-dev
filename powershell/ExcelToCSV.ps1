    $excelFile = "g:\work\ASPNET-02\SR\IN\Sectional Review MPK-20171125-PS.xlsx"
    $csvLoc = "g:\work\ASPNET-02\SR\OUT"
    $E = New-Object -ComObject Excel.Application
    $E.Visible = $false
    $E.DisplayAlerts = $false
    $wb = $E.Workbooks.Open($excelFile)
    foreach ($ws in $wb.Worksheets)
    {
        $n = $excelFileName + "_" + $ws.Name
        $ws.SaveAs($csvLoc + $n + ".csv", 6)
    }
    $E.Quit()
