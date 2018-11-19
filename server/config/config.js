const config = {
  "merchantId": "2002cbfe-9adf-42ac-9bfd-8e013fee7c18",
  "developerApiUrl": "http://martjack.com/DeveloperAPI/",
  "base_dev_url": "http://martjack.com/DeveloperAPI/",
  "frontendApiUrl": "http://sg-frontapi.ecom.capillary.in",
  "frontendApiUrlV3": "https://sg-frontapi.ecom.capillary.in",
  "publicKey": "DQIT6SJJ",
  "secretKey": "NEOV9AGGGLYHERHRBSOTBROD",
  "baseUrl": "http://localhost:3000/api/",
  "server": {
    "mw-static": {
      "maxAge": "1 day"
    }
  },
    "prerender": {
      "token": "Aa9bwxzH40uPNZRBPpC9"
    },
    "prerenderer": {
        "enabled": true,
        "proxyUrl": "http://prerenderer.pwatest.capillary.in/render/",
        "exclude": [
            'product-details',
            'cart',
            'user-profile',
            'change-password',
            'order-history',
            'saved-address',
            'add-address',
            'favorites',
            'store-selection',
            'my-account',
            'delivery-slot-selection',
            'order-details',
            'checkout',
            'success'
        ]
    },
  "enableRedisCaching": false,
  "graphite": {
    "host": "graphite-carbon.deis",
    "port": "2003",
    "prefix" : "pwa.sauditest",
    "log" : true,
  },
  "logger": {
    "logging": {
      "default": {
        "console": {
          "level": "debug",
          "colorize": true,
          "timestamp": true
        }
      },
      "Server": {
        "dailyRotateFile": {
          "level": "debug",
          "colorize": false,
          "timestamp": true,
          "datePattern": "YYYY-MM-DD",
          "filename": "/var/log/capillary/test/server.log",
          "maxFiles": "10d",
          "maxsize": 100000000,
          "json": false
        },
        "console": {
          "level": "debug",
          "colorize": true,
          "timestamp": true
        }
      },
      "ACCESS": {
        "dailyRotateFile": {
          "level": "debug",
          "colorize": false,
          "timestamp": true,
          "datePattern": "YYYY-MM-DD",
          "filename": "/var/log/capillary/test/access.log",
          "maxFiles": "1d",
          "maxsize": 100000000,
          "json": false
        },
        "console": {
          "level": "debug",
          "colorize": true,
          "timestamp": true
        }
      },
      "BACKEND": {
        "dailyRotateFile": {
          "level": "debug",
          "colorize": false,
          "timestamp": true,
          "datePattern": "YYYY-MM-DD",
          "filename": "/var/log/capillary/test/backend.log",
          "maxFiles": "1d",
          "maxsize": 100000000,
          "json": false
        },
        "console": {
          "level": "debug",
          "colorize": true,
          "timestamp": true
        }
      },
      "ERROR": {
        "dailyRotateFile": {
          "level": "debug",
          "colorize": false,
          "timestamp": true,
          "datePattern": "YYYY-MM-DD",
          "filename": "/var/log/capillary/test/error.log",
          "maxFiles": "1d",
          "maxsize": 100000000,
          "json": false
        },
        "console": {
          "level": "debug",
          "colorize": true,
          "timestamp": true
        }
      },
      "FORENSIC": {
        "dailyRotateFile": {
          "level": "debug",
          "colorize": false,
          "timestamp": true,
          "datePattern": "YYYY-MM-DD",
          "filename": "/var/log/capillary/test/forensic.log",
          "maxFiles": "1d",
          "maxsize": 100000000,
          "json": false
        },
        "console": {
          "level": "debug",
          "colorize": true,
          "timestamp": true
        }
      }
    }
  },
  "cdn": {
    "enabled": true,
    "provider": "cloudfare"
  },
  "isAsapEnabled": true,
  "attributes": [{
    "id": 18,
    "name": "IsImmediateOrder"
  },
    {
      "id": 32,
      "name": "channelid"
    }],
  "intouchCluster" : "https://api.capillary.co.in",
  "survey": {
    "credentials": {
      "username": "kn.003",
      "password": "202cb962ac59075b964b07152d234b70"
    },
    "to": "shanuj.bansal@capillarytech.com",
    "subject": "Order Feedback"
  },
  "defaultStoreId": 13264,
};

module.exports = config;
