export function avaBannerManagement(lang) {
  const affid = '209215'
  const campaign = '221989'
  const campaignName = 'Default'
  const isMobile = window.matchMedia('(max-width: 1366px)').matches
  const banners = [
    {
      it: {
        mobile: {
          html5Id: '36225',
          adTheme: '770',
          style: 'width:120px;height:600px;'
        },
        desktop: {
          html5Id: '36228',
          adTheme: '770',
          style: 'width:250px;height:250px;'
        }
      },
      en: {
        mobile: {
          html5Id: '35535',
          adTheme: '786',
          style: 'width:120px;height:600px;'
        },
        desktop: {
          html5Id: '35682',
          adTheme: '770',
          style: 'width:250px;height:250px;'
        }
      }
    },
    {
      it: {
        mobile: {
          html5Id: '35459',
          adTheme: '804',
          style: 'width:120px;height:600px;'
        },
        desktop: {
          html5Id: '35460',
          adTheme: '804',
          style: 'width:250px;height:250px;'
        }
      },
      en: {
        mobile: {
          html5Id: '35470',
          adTheme: '804',
          style: 'width:120px;height:600px;'
        },
        desktop: {
          html5Id: '35471',
          adTheme: '804',
          style: 'width:250px;height:250px;'
        }
      }
    },
    {
      it: {
        mobile: {
          html5Id: '35524',
          adTheme: '786',
          style: 'width:120px;height:600px;'
        },
        desktop: {
          html5Id: '35525',
          adTheme: '786',
          style: 'width:250px;height:250px;'
        }
      },
      en: {
        mobile: {
          html5Id: '35535',
          adTheme: '786',
          style: 'width:120px;height:600px;'
        },
        desktop: {
          html5Id: '35536',
          adTheme: '786',
          style: 'width:250px;height:250px;'
        }
      }
    },
    {
      it: {
        mobile: {
          html5Id: '36226',
          adTheme: '770',
          style: 'width:160px;height:600px;'
        },
        desktop: {
          html5Id: '36238',
          adTheme: '770',
          style: 'width:600px;height:314px;'
        }
      },
      en: {
        mobile: {
          html5Id: '35680',
          adTheme: '770',
          style: 'width:160px;height:600px;'
        },
        desktop: {
          html5Id: '35668',
          adTheme: '770',
          style: 'width:600px;height:314px;'
        }
      }
    },
    {
      it: {
        mobile: {
          html5Id: '36226',
          adTheme: '770',
          style: 'width:160px;height:600px;'
        },
        desktop: {
          html5Id: '36238',
          adTheme: '770',
          style: 'width:600px;height:314px;'
        }
      },
      en: {
        mobile: {
          html5Id: '35680',
          adTheme: '770',
          style: 'width:160px;height:600px;'
        },
        desktop: {
          html5Id: '35668',
          adTheme: '770',
          style: 'width:600px;height:314px;'
        }
      }
    },
    {
      it: {
        mobile: {
          html5Id: '36226',
          adTheme: '770',
          style: 'width:160px;height:600px;'
        },
        desktop: {
          html5Id: '36238',
          adTheme: '770',
          style: 'width:600px;height:314px;'
        }
      },
      en: {
        mobile: {
          html5Id: '35680',
          adTheme: '770',
          style: 'width:160px;height:600px;'
        },
        desktop: {
          html5Id: '35668',
          adTheme: '770',
          style: 'width:600px;height:314px;'
        }
      }
    }
  ]
  banners.forEach((banner, i) => {
    const device = isMobile ? 'mobile': 'desktop'
    const bannerTypeParam = banner[lang][device].bannerid ? 'bannerid': 'html5Id'
    const url = `https://tracking.avapartner.com/impression/?affid=${affid}&${bannerTypeParam}=${banner[lang][device][bannerTypeParam]}&adTheme=${banner[lang][device].adTheme}&campaign=${campaign}&campaignName=${campaignName}%20Campaign&tag=${affid}`
    const ifr = document.createElement('iframe')
    ifr.setAttribute('src', url + '&sid=' + Math.random())
    ifr.setAttribute('frameborder', '0')
    ifr.setAttribute('scrolling','no')
    ifr.setAttribute('title','AVATRADE Sponsor banner')
    ifr.setAttribute('style', banner[lang][device].style)
    const cP = document.getElementById('ava-banner-' + i)
    if(cP) cP.appendChild(ifr)
  })
}
