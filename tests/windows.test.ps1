Describe "run-script-os" -Tags "CI" {
    It "should run as expected with pre/post variables" {
        $date_time = Get-Date ([datetime]::UtcNow) -UFormat "%Y%m%d-%H%M%S"
        # date_time = "20201224-210751"
        $expected = "windows.expected.txt"
        $actual = "windows.actual.$date_time.txt"
        # actual = "windows.actual.20201224-210751.txt"

        npm run-script test --silent > $actual
        $LASTEXITCODE | Should -Be 0

        $diff = Compare-Object -ReferenceObject (Get-Content $expected) -DifferenceObject (Get-Content $actual)
        $diffCount = $diff | Measure-Object | Select-Object -ExpandProperty Count
        $diffCount | Should -Be 0
    }

    It "should be able to error out as expected" {
        npm run-script test-error --silent
        $LASTEXITCODE | Should -Be 22
    }
}
