#!node_modules/.bin/bats

@test "It should run as expected with pre/post variables" {
  date_time=$(date -u +"%Y%m%d-%H%M%S")
  # expected="20201224-210751"
  expected="$NIX_OS.expected.txt"
  # expected="linux.expected.txt"
  actual="$NIX_OS.actual.$date_time.txt"
  # actual="linux.actual.20201224-210751.txt"

  run $(npm run-script sample --silent > $actual)
  [ "$status" -eq 0 ]
  
  run diff --text $expected $actual
  [ "$status" -eq 0 ]
}

@test "It should be able to error out as expected" {
  run npm run-script test-error --silent
  [ "$status" -eq 11 ]
}