#ifndef STACK_WRAPPER_BASE_H
#define STACK_WRAPPER_BASE_H

#include <napi.h>
#include "TrackedStack.h"

template<typename T>
class StackWrapperBase : public Napi::ObjectWrap<StackWrapperBase<T>> {
    protected:
        TrackedStack<T> stack;

    public:
        StackWrapperBase(Napi::CallbackInfo &info) : Napi::ObjectWrap<StackWrapperBase<T>>(info) {}

        Napi::Value Size(Napi::CallbackInfo &info);
        Napi::Value Empty(Napi::CallbackInfo &info);
        Napi::Value GetTrace(Napi::CallbackInfo &info);
        Napi::Value Clear(Napi::CallbackInfo &info);
};

template<typename T>
Napi::Value StackWrapperBase<T>::Size(Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();
    return Napi::Number::New(env, stack.size());
}

template<typename T>
Napi::Value StackWrapperBase<T>::Empty(Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();
    return Napi::Number::New(env, stack.isEmpty());
}

template<typename T>
Napi::Value StackWrapperBase<T>::GetTrace(Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();
    std::string traceJson = stack.getExecutionTrace();
    return Napi::String::New(env, traceJson);
}

template<typename T>
Napi::Value StackWrapperBase<T>::Clear(Napi::CallbackInfo &info) {
    Napi::Env env = info.Env();
    stack.clear();
    return env.Undefined();
}

#endif