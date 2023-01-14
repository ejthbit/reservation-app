const ua = navigator.userAgent

export const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(
    ua
)
export const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
export const isIOS = /|iPhone|iPad|iPod/i.test(ua)
