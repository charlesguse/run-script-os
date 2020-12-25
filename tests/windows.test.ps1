Describe "run-script-os" -Tags "CI" {
    It "should run as expected with pre/post variables" {
        $date_time = Get-Date ([datetime]::UtcNow) -UFormat "%Y%m%d-%H%M%S"
        $expected = "windows.expected.txt"
        $actual = "windows.actual.$date_time.txt"

        npm run-script sample --silent > $actual
        $Global:LASTEXITCODE | Should -Be 0

        $diff = Compare-Object -ReferenceObject (Get-Content $expected) -DifferenceObject (Get-Content $actual)
        $diffCount = $diff | Measure-Object | Select-Object -ExpandProperty Count
        $diffCount | Should -Be 0
    }

    It "should be able to error out as expected" {
        npm run-script test-error --silent
        $Global:LASTEXITCODE | Should -Be 22
        $Global:LASTEXITCODE = 0
    }

    It "this test should fail" {
        npm run-script test-error --silent
        $Global:LASTEXITCODE | Should -Be 23
        $Global:LASTEXITCODE = 0
    }
}
