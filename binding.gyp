{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "src/decode.cc" ],
      'cflags!': [ '-fno-exceptions' ],
      'cflags_cc!': [ '-fno-exceptions' ],
      'conditions': [
        ['OS=="mac"', {
          'xcode_settings': {
            'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
          }
        }]
      ],
      "libraries": [
        "-lheif"
      ]
    }
  ]
}
