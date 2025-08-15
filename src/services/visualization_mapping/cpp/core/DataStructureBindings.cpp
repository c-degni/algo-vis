#include <napi.h>

Napi::Object StackModule_Init(Napi::Env env, Napi::Object exports);
// Queue next

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    StackModule_Init(env, exports);
    // Queue next
    return exports;
}

NODE_API_MODULE(data_structures, Init)
