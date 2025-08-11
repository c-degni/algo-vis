#include "IntStackWrapper.h"

static Napi::Object Init(Napi::Env env, Napi::Object exports) {
    Napi::Function f = DefineClass(env, "IntStack", {
        InstanceMethod("push", &IntStackWrapper::Push),
        InstanceMethod("pop", &IntStackWrapper::Pop),
        InstanceMethod("top", &IntStackWrapper::Top),
        InstanceMethod("empty", &IntStackWrapper::Empty),
        InstanceMethod("size", &IntStackWrapper::Size),
        InstanceMethod("clear", &IntStackWrapper::Clear),
        InstanceMethod("getTrace", &IntStackWrapper::GetTrace)
    });

    Napi::FunctionReference *constructor = new Napi::FunctionReference();
    *constructor = Napi::Persistent(f);
    env.SetInstanceData(constructor);

    exports.Set("IntStack", f);
    return exports;
}

Napi::Value IntStackWrapper::Push(Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();
    if (info.Length() < 1 || !info[0].IsNumber()) {
        Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
        return env.Null();
    }
    
    int val = info[0].As<Napi::Number>().Int32Value();
    stack.push(val);
    return env.Undefined();
}

Napi::Value IntStackWrapper::Pop(Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();
    try {
        int val = stack.pop();
        return Napi::Number::New(env, val);
    } catch (std::exception &e) {
        Napi::Error::New(env, e.what()).ThrowAsJavaScriptException();
        return env.Null();
    }
}

Napi::Value IntStackWrapper::Top(Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();
    try {
        int val = stack.top();
        return Napi::Number::New(env, val);
    } catch (const std::exception &e) {
        Napi::Error::New(env, e.what()).ThrowAsJavaScriptException();
        return env.Null();
    }
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
    IntStackWrapper::Init(env, exports);
    return exports;
}

NODE_API_MODULE(cpp_ds, Init)