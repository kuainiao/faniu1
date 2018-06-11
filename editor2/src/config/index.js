export const imgBaseUrl = 'http://bj.lawbang.com/Wxmaterial/Api/getPicApi/id/'
export const imgBaseUrl2 = 'http://bj.lawbang.com/'

export function baseuploadurl () {
  if (process.env.NODE_ENV === 'production') {
    return 'http://bj.lawbang.com/Wxmaterial/'
  } else {
    return 'api/Wxmaterial/'
  }
}

export function getId () {
  return getlocalStorage('id')
}

export function setlocalStorage (key, value) {
  localStorage.setItem(key, value)
}
export function getlocalStorage (key) {
  return localStorage.getItem(key)
}
export function removelocalStorage (key) {
  localStorage.removeItem(key)
}



















