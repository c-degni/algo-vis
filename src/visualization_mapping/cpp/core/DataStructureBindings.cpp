#include <napi.h>

Napi::Object StackModule_Init(Napi::Env env, Napi::Object exports);
Napi::Object QueueModule_Init(Napi::Env env, Napi::Object exports);
Napi::Object LinkedListModule_Init(Napi::Env env, Napi::Object exports);

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    StackModule_Init(env, exports);
    QueueModule_Init(env, exports);
    LinkedListModule_Init(env, exports);
    return exports;
}

NODE_API_MODULE(data_structures, Init)
