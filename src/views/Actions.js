import eyeBlueIcon from "../assets/svg/eye_blue.js"
import downloadBlueIcon from "../assets/svg/download_blue.js"
import downloadWhite from '../assets/svg/download_white.js'

export const eyeIcon = (billUrl) => {
  return `<div class="icon-actions">
      <div id="eye" data-testid="icon-eye" data-bill-url=${billUrl}>
      ${eyeBlueIcon}
      </div>
    </div>`
}
export const downloadIconBlue = (billUrl) => {
  return `<div class="icon-actions">
      <div id="download" data-testid="icon-download" data-bill-url=${billUrl}>
      ${downloadBlueIcon}
      </div>
    </div>`
}
export const downloadIconWhite = (billUrl) => {
  return `<div class="icon-actions">
      <div id="download" data-testid="icon-download" data-bill-url=${billUrl}>
      ${downloadWhite}
      </div>
    </div>`
}


