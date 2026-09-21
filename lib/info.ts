import { browser } from "#imports";

export function getAppName() {
  return browser.runtime.getManifest().name;
}

export function getAppVersion() {
  return browser.runtime.getManifest().version;
}
