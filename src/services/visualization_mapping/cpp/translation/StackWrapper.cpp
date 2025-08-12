#include  <napi.h>
#include "TrackedStack.h"

// "start clock rising edge on parity sequence 101" - cuz

#define TYPED_STACK_WRAPPER(TypeName, CppType, JsCheck, JsConvert, JsCreate)                                            \
class TypeName##StackWrapper : public Napi::ObjectWrap<TypeName##StackWrapper> {                                        \
    private:                                                                                                            \
        TrackedStack<CppType> stack;                                                                                    \
                                                                                                                        \
    public:                                                                                                             \
        static Napi::Object Init(Napi::Env env, Napi::Object exports) {                                                 \
            Napi::Function f = DefineClass(env, #TypeName "Stack", {                                                    \
                InstanceMethod("push", &TypeName##StackWrapper::Push),                                                  \
                InstanceMethod("pop", &TypeName##StackWrapper::Pop),                                                    \
                InstanceMethod("top", &TypeName##StackWrapper::Top),                                                    \
                InstanceMethod("empty", &TypeName##StackWrapper::Empty),                                                \
                InstanceMethod("size", &TypeName##StackWrapper::Size),                                                  \
                InstanceMethod("clear", &TypeName##StackWrapper::Clear),                                                \
                InstanceMethod("getTrace", &TypeName##StackWrapper::GetTrace)                                           \
            });                                                                                                         \
            exports.Set(#TypeName "Stack", f);                                                                          \
            return exports;                                                                                             \
        }                                                                                                               \
                                                                                                                        \
        TypeName##StackWrapper(const Napi::CallbackInfo &info) : Napi::ObjectWrap<TypeName##StackWrapper>(info) {}      \
                                                                                                                        \
        Napi::Value Push(const Napi::CallbackInfo &info) {                                                              \
            Napi::Env env = info.Env();                                                                                 \
            if (info.Length() < 1 || !info[0].JsCheck()) {                                                              \
                Napi::TypeError::New(env, #CppType " expected").ThrowAsJavaScriptException();                           \
                return env.Null();                                                                                      \
            }                                                                                                           \
            CppType val = info[0].JsConvert();                                                                          \
            stack.push(val);                                                                                            \
            return env.Undefined();                                                                                     \
        }                                                                                                               \
                                                                                                                        \
        Napi::Value Pop(const Napi::CallbackInfo &info) {                                                               \
            Napi::Env env = info.Env();                                                                                 \
            try {                                                                                                       \
                CppType val = stack.pop();                                                                              \
                return JsCreate(env, val);                                                                              \
            } catch (const std::exception &e) {                                                                         \
                Napi::Error::New(env, e.what()).ThrowAsJavaScriptException();                                           \
                return env.Null();                                                                                      \
            }                                                                                                           \
        }                                                                                                               \
                                                                                                                        \
        Napi::Value Top(const Napi::CallbackInfo &info) {                                                               \
            Napi::Env env = info.Env();                                                                                 \
            try {                                                                                                       \
                CppType val = stack.top();                                                                              \
                return JsCreate(env, val);                                                                              \    
            } catch (const std::exception &e) {                                                                         \
                Napi::Error::New(env, e.what()).ThrowAsJavaScriptException();                                           \
                return env.Null();                                                                                      \
            }                                                                                                           \
        }                                                                                                               \
                                                                                                                        \
        Napi::Value Size(const Napi::CallbackInfo &info) {                                                              \
            Napi::Env env = info.Env();                                                                                 \   
            return Napi::Number::New(env, stack.size());                                                                \
        }                                                                                                               \
                                                                                                                        \
        Napi::Value Empty(const Napi::CallbackInfo& info) {                                                             \
            Napi::Env env = info.Env();                                                                                 \
            return Napi::Boolean::New(env, stack.isEmpty());                                                            \
        }                                                                                                               \
                                                                                                                        \
        Napi::Value Clear(const Napi::CallbackInfo& info) {                                                             \
            Napi::Env env = info.Env();                                                                                 \
            stack.clear();                                                                                              \
            return env.Undefined();                                                                                     \
        }                                                                                                               \
                                                                                                                        \
        Napi::Value GetTrace(const Napi::CallbackInfo& info) {                                                          \
            Napi::Env env = info.Env();                                                                                 \
            std::string json = stack.getExecutionTrace();                                                               \
            return Napi::String::New(env, json);                                                                        \
        }                                                                                                               \
};                                        

// Add string stack wrapper def (could be macro to fit in with rest idk yet)

TYPED_STACK_WRAPPER(Int, int, IsNumber, As<Napi::Number>().Int32Value, Napi::Number::New)
TYPED_STACK_WRAPPER(Double, double, IsNumber, As<Napi::Number>().DoubleValue, Napi::Number::New)
TYPED_STACK_WRAPPER(Float, float, IsNumber, As<Napi::Number>().FloatValue, Napi::Number::New)
TYPED_STACK_WRAPPER(Bool, bool, IsBoolean, As<Napi::Boolean>().Value, Napi::Boolean::New)
// Add string stack wrapper instantiation

Napi::Object StackModule_Init(Napi::Env env, Napi::Object exports) {
    IntStackWrapper::Init(env, exports);
    DoubleStackWrapper::Init(env, exports);
    FloatStackWrapper::Init(env, exports);
    BoolStackWrapper::Init(env, exports);
    // Add string stack wrapper init
    return exports;
}

// NODE_API_MODULE(cpp_stack, StackModule_Init)
