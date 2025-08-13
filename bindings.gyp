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
                "src/services/visualization_mapping/cpp/data_structures",
                "src/services/visualization_mapping/cpp/core"
            ],
            "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"],
            "cflags!": ["-fno-exceptions"],
            "cflags_cc!": ["-fno-exceptions"],
            "conditions": [
                ["OS=='mac'", {
                    "msvs_settings": {
                        "VCCLCompilerTool": {
                            "ExceptionHandling": 1
                        }
                    }
                }]
            ]
        }
    ]
}