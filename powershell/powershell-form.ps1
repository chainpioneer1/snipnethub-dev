Add-Type -AssemblyName System.Windows.Forms

$Form = New-Object system.Windows.Forms.Form
$Form.Text = "Form"
$Form.TopMost = $true
$Form.Width = 322
$Form.Height = 223

$textBox2 = New-Object system.windows.Forms.TextBox
$textBox2.Width = 268
$textBox2.Height = 20
$textBox2.location = new-object system.drawing.point(10,20)
$textBox2.Font = "Microsoft Sans Serif,10"
$Form.controls.Add($textBox2)

$textBox2 = New-Object system.windows.Forms.TextBox
$textBox2.Width = 268
$textBox2.Height = 20
$textBox2.location = new-object system.drawing.point(10,20)
$textBox2.Font = "Microsoft Sans Serif,10"
$Form.controls.Add($textBox2)

$button4 = New-Object system.windows.Forms.Button
$button4.Text = "button"
$button4.Width = 60
$button4.Height = 30
$button4.location = new-object system.drawing.point(10,121)
$button4.Font = "Microsoft Sans Serif,10"
$Form.controls.Add($button4)

$checkBox5 = New-Object system.windows.Forms.CheckBox
$checkBox5.Text = "checkBox"
$checkBox5.AutoSize = $true
$checkBox5.Width = 95
$checkBox5.Height = 20
$checkBox5.location = new-object system.drawing.point(10,67)
$checkBox5.Font = "Microsoft Sans Serif,10"
$Form.controls.Add($checkBox5)

[void]$Form.ShowDialog()
$Form.Dispose()