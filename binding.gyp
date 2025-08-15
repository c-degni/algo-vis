{
    "targets": [
        {
            "target_name": "data_structures",
            "sources": [
                "src/services/visualization_mapping/cpp/core/ExecutionTracer.cpp",
                "src/services/visualization_mapping/cpp/core/DataStructureBindings.cpp",
                "src/services/visualization_mapping/cpp/translation/StackWrapper.cpp"
            ],
            "include_dirs": [
                "<!@(node -p \"require('node-addon-api').include\")",
                "src/services/visualization_mapping/cpp",
                "src/services/visualization_mapping/cpp/data_structures",
                "src/services/visualization_mapping/cpp/core"
            ],
            "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS=1"],
            "cflags!": ["-fno-exceptions"],
            "cflags_cc!": [
                "-fno-exceptions", 
                "-std=c++17"
            ],
            "xcode_settings": {
                "CLANG_CXX_LANGUAGE_STANDARD": "c++17",
                "GCC_ENABLE_CPP_EXCEPTIONS": "NO",
                "OTHER_CPLUSPLUSFLAGS": [ "-std=c++17", "-fno-exceptions" ]
            },
            "conditions": [
                ["OS=='mac'", {
                    "msvs_settings": {
                        "VCCLCompilerTool": {
                            "ExceptionHandling": 0,
                            "AdditionalOptions": [ "/std:c++17" ]
                        }
                    }
                }]
            ]
        }
    ]
}