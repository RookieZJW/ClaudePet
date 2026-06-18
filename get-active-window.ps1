Add-Type -Name WA -Namespace T -MemberDefinition @'
[DllImport("user32.dll")]
public static extern IntPtr GetForegroundWindow();
[DllImport("user32.dll")]
public static extern bool GetWindowRect(IntPtr h, out RECT r);
public struct RECT { public int Left, Top, Right, Bottom; }
'@
$rect = New-Object T.WA+RECT
$hwnd = [T.WA]::GetForegroundWindow()
if ($hwnd -ne [IntPtr]::Zero) {
  [T.WA]::GetWindowRect($hwnd, [ref]$rect)
  Write-Output "$($rect.Left),$($rect.Top),$($rect.Right),$($rect.Bottom)"
}
