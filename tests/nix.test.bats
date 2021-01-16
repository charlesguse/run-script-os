#!node_modules/.bin/bats
generate_results_filename () {
  local date_time=$(date -u +"%Y%m%d-%H%M%S")
  local uuid=$(uuidgen)
  echo "$NIX_OS.actual.$date_time._.$uuid.txt"
}

# It = run-scripts-os
@test "It should run as expected with pre/post variables" {
  local expected="$NIX_OS.expected.txt"
  local results=$(generate_results_filename)

  run $(npm run-script sample --silent > $results)
  [ "$status" -eq 0 ]
  
  run diff --text $expected $results
  [ "$status" -eq 0 ]
}

@test "It should be able to error out as expected" {
  run npm run-script test-error --silent
  [ "$status" -eq 11 ]
}

@test "It should be able to be able to pass arguements along" {
  local expected="Hello, run-script-os."

  run npm run-script test-args --silent
  [ "$status" -eq 0 ]
  [ "$output" = "$expected" ]
}

@test "It should be able to use the darwin alias for MacOS" {
  local expected="darwin"

  if [ "$NIX_OS" != "macos" ]
  then
    expected="not darwin"
  fi

  run npm run-script test-darwin --silent
  [ "$status" -eq 0 ]
  [ "$output" = "$expected" ]
}