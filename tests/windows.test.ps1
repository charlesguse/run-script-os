
Describe "run-script-os" {
    BeforeAll {
        function Get-GenerateResultsFilename {
            $date_time = Get-Date ([datetime]::UtcNow) -UFormat "%Y%m%d-%H%M%S"
            $guid = [guid]::newguid()
            "windows.actual.$date_time._.$guid.txt"
        }
    }

    It "should run as expected with pre/post variables" {
        $expected = "windows.expected.txt"
        $results = Get-GenerateResultsFilename

        npm run-script sample --silent > $results
        $Global:LASTEXITCODE | Should -Be 0

        $diff = Compare-Object -ReferenceObject (Get-Content $expected) -DifferenceObject (Get-Content $results)
        $diffCount = $diff | Measure-Object | Select-Object -ExpandProperty Count
        $diffCount | Should -Be 0
    }

    It "should be able to error out as expected" {
        npm run-script test-error --silent
        $Global:LASTEXITCODE | Should -Be 22
    }

    It "should be able to be able to pass arguements along" {
        $expected = """'Hello,'"" ""'run-script-os.'"""

        $output = npm run-script test-args --silent
        $output | Should -Be $expected
    }
}
