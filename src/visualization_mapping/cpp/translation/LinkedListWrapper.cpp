#include <napi.h>
#include <string>
#include "TrackedLinkedList.h"

#define TYPED_LL_WRAPPER(TypeName, CppType, JsCheck, JsConvert, JsCreate)                                               \
class TypeName##LLWrapper : public Napi::ObjectWrap<TypeName##LLWrapper> {                                              \
    private:                                                                                                            \
        TrackedLinkedList<CppType> ll;                                                                                  \
                                                                                                                        \
    public:                                                                                                             \
        static Napi::Object Init(Napi::Env env, Napi::Object exports) {                                                 \
            Napi::Function f = DefineClass(env, #TypeName "LinkedList", {                                               \
                InstanceMethod("insert", &TypeName##LLWrapper::Insert),                                                 \
                InstanceMethod("remove", &TypeName##LLWrapper::Remove),                                                 \
                InstanceMethod("find", &TypeName##LLWrapper::Find),                                                     \
                InstanceMethod("size", &TypeName##LLWrapper::Size),                                                     \
                InstanceMethod("clear", &TypeName##LLWrapper::Clear),                                                   \
                InstanceMethod("getTrace", &TypeName##LLWrapper::GetTrace)                                              \
            });                                                                                                         \
            exports.Set(#TypeName "LinkedList", f);                                                                     \
            return exports;                                                                                             \
        }                                                                                                               \
                                                                                                                        \
        TypeName##LLWrapper(const Napi::CallbackInfo &info) : Napi::ObjectWrap<TypeName##LLWrapper>(info) {}            \
        ~TypeName##LLWrapper() noexcept override = default;                                                             \
                                                                                                                        \
        Napi::Value Insert(const Napi::CallbackInfo &info) {                                                            \
            Napi::Env env = info.Env();                                                                                 \
            if (info.Length() < 1 || !info[0].JsCheck()) {                                                              \
                Napi::TypeError::New(env, #CppType " expected").ThrowAsJavaScriptException();                           \
                return env.Null();                                                                                      \
            }                                                                                                           \
            CppType val = info[0].JsConvert();                                                                          \
            ll.insert(val);                                                                                             \
            return env.Undefined();                                                                                     \
        }                                                                                                               \
                                                                                                                        \
        Napi::Value Remove(const Napi::CallbackInfo &info) {                                                            \
            Napi::Env env = info.Env();                                                                                 \
            if (info.Length() < 1 || !info[0].JsCheck()) {                                                              \
                Napi::TypeError::New(env, #CppType " expected").ThrowAsJavaScriptException();                           \
                return env.Null();                                                                                      \
            }                                                                                                           \
            CppType val = info[0].JsConvert();                                                                          \
            auto removed = ll.remove(val);                                                                              \
            if (!removed.has_value()) {                                                                                 \
                Napi::Error::New(env, "Linked list is empty").ThrowAsJavaScriptException();                             \
                return env.Null();                                                                                      \
            }                                                                                                           \
            return JsCreate(env, *removed);                                                                             \
        }                                                                                                               \
                                                                                                                        \
        Napi::Value Find(const Napi::CallbackInfo &info) {                                                              \
            Napi::Env env = info.Env();                                                                                 \
            if (info.Length() < 1 || !info[0].JsCheck()) {                                                              \
                Napi::TypeError::New(env, #CppType " expected").ThrowAsJavaScriptException();                           \
                return env.Null();                                                                                      \
            }                                                                                                           \
            auto found = ll.find(val);                                                                                  \
            if (!found.has_value()) {                                                                                   \
                Napi::Error::New(env, val + " is not in linked list").ThrowAsJavaScriptException();                     \
                return env.Null();                                                                                      \
            }                                                                                                           \
            return JsCreate(env, *found);                                                                               \
        }                                                                                                               \
                                                                                                                        \
        Napi::Value Size(const Napi::CallbackInfo &info) {                                                              \
            Napi::Env env = info.Env();                                                                                 \
            return Napi::Number::New(env, ll.size());                                                                   \
        }                                                                                                               \
                                                                                                                        \
        Napi::Value Clear(const Napi::CallbackInfo& info) {                                                             \
            Napi::Env env = info.Env();                                                                                 \
            ll.clear(true);                                                                                             \
            return env.Undefined();                                                                                     \
        }                                                                                                               \
                                                                                                                        \
        Napi::Value GetTrace(const Napi::CallbackInfo& info) {                                                          \
            Napi::Env env = info.Env();                                                                                 \
            std::string json = ll.getExecutionTrace();                                                                  \
            return Napi::String::New(env, json);                                                                        \
        }                                                                                                               \
};                                                                                                         

TYPED_LL_WRAPPER(Int, int, IsNumber, As<Napi::Number>().Int32Value, Napi::Number::New)
TYPED_LL_WRAPPER(Double, double, IsNumber, As<Napi::Number>().DoubleValue, Napi::Number::New)
TYPED_LL_WRAPPER(Float, float, IsNumber, As<Napi::Number>().FloatValue, Napi::Number::New)
TYPED_LL_WRAPPER(Bool, bool, IsBoolean, As<Napi::Boolean>().Value, Napi::Boolean::New)
TYPED_LL_WRAPPER(String, std::string, IsString, As<Napi::String>().Utf8Value, Napi::String::New)

Napi::Object QueueModule_Init(Napi::Env env, Napi::Object exports) {
    IntLLWrapper::Init(env, exports);
    DoubleLLWrapper::Init(env, exports);
    FloatLLWrapper::Init(env, exports);
    BoolLLWrapper::Init(env, exports);
    StringLLWrapper::Init(env, exports);
    return exports;
}