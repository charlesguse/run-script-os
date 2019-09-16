 /**
  * Match script to the list of available scripts, or check for aliases
  *
  * The order for checking matches should be direct-platform and then aliases
  *
  * @param {string} script   - name of the script to be matched paired to the platform or alias
  * @param {string} platform - name of the platform to be paired with the script
  * @param {array}  scripts  - list of available scripts defined in package.json
  */
 exports.matchScript = function matchScript(script, platform, scripts) {
  /**
   * Save the result so we can determine if there was a match
   * First check for a basic match before we have to go through each script with a regex
   */
  let result = (`${script}:${platform}` in scripts) ? `${script}:${platform}` : false;
  if(result){
    return result;
  }
  
  /**
   * Regular expresion match
   * it helps when the "in" operator can't determine if there's a real match or not,
   * due to the properties changing
   */
  let regex = new RegExp(`^(${script}):([a-zA-Z0-9-]*:)*(${platform})(:[a-zA-Z0-9-]*)*$`, "g");
  for (let command in scripts) {
    if (command.match(regex)) return command;
  }

  /**
   * Alias match, allows for a more verbose description of the platform
   * it also helps to group similar platforms on a single execution
   */
  switch (platform) {
    case 'win32': result = (`${script}:windows` in scripts) ? `${script}:windows` : false;

    case 'aix':
    case 'linux':
    case 'sunos':
    case 'openbsd':
    case 'freebsd':
    case 'android': result = (`${script}:nix` in scripts) ? `${script}:nix` : false;

    case 'darwin':
      /**
       * macOS specific scripts (e.g. brew)
       */
      result = (`${script}:darwin` in scripts) ? `${script}:darwin` : false;

      /**
       * nix compatible scripts (cp, rm...)
       */
      if(!result) {
        result = (`${script}:nix` in scripts) ? `${script}:nix` : false;
	  }

      break;

    default: return false;
  }

  /**
   * Test if no script could be matched and try to return the default
   */
  return result ? result : (`${script}:default` in scripts);
};
