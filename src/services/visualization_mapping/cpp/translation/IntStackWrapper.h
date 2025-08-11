#ifndef INT_STACK_WRAPPER
#define INT_STACK_WRAPPER

#include "StackWrapperBase.h"

class IntStackWrapper : public StackWrapperBase<int> {
    public:
        static Napi::Object Init(Napi::Env env, Napi::Object exports);

        IntStackWrapper(Napi::CallbackInfo& info) : StackWrapperBase<int>(info) {}

        Napi::Value Push(Napi::CallbackInfo &info);
        Napi::Value Pop(Napi::CallbackInfo &info);
        Napi::Value Top(Napi::CallbackInfo &info);
};

Napi::Object Init(Napi::Env env, Napi::Object exports);

#endif