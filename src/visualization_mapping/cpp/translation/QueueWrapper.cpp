#include <napi.h>
#include <string>
#include "TrackedQueue.h"

#define TYPED_QUEUE_WRAPPER(TypeName, CppType, JsCheck, JsConvert, JsCreate)                                            \
class TypeName##QueueWrapper : public Napi::ObjectWrap<TypeName##QueueWrapper> {                                        \
    private:                                                                                                            \
        TrackedQueue<CppType> queue;                                                                                    \
                                                                                                                        \
    public:                                                                                                             \
        static Napi::Object Init(Napi::Env env, Napi::Object exports) {                                                 \
            Napi::Function f = DefineClass(env, #TypeName "Queue", {                                                    \
                InstanceMethod("enqueue", &TypeName##QueueWrapper::Enqueue),                                            \
                InstanceMethod("dequeue", &TypeName##QueueWrapper::Dequeue),                                            \
                InstanceMethod("front", &TypeName##QueueWrapper::Front),                                                \
                InstanceMethod("empty", &TypeName##QueueWrapper::Empty),                                                \
                InstanceMethod("isEmpty", &TypeName##QueueWrapper::IsEmpty),                                            \
                InstanceMethod("size", &TypeName##QueueWrapper::Size),                                                  \
                InstanceMethod("getTrace", &TypeName##QueueWrapper::GetTrace)                                           \
            });                                                                                                         \
            exports.Set(#TypeName "Queue", f);                                                                          \
            return exports;                                                                                             \
        }                                                                                                               \
                                                                                                                        \
        TypeName##QueueWrapper(const Napi::CallbackInfo &info) : Napi::ObjectWrap<TypeName##QueueWrapper>(info) {}      \
        ~TypeName##QueueWrapper() noexcept override = default;                                                          \
                                                                                                                        \
        Napi::Value Enqueue(const Napi::CallbackInfo &info) {                                                           \
            Napi::Env env = info.Env();                                                                                 \
            if (info.Length() < 1 || !info[0].JsCheck()) {                                                              \
                Napi::TypeError::New(env, #CppType " expected").ThrowAsJavaScriptException();                           \
                return env.Null();                                                                                      \
            }                                                                                                           \
            CppType val = info[0].JsConvert();                                                                          \
            queue.enqueue(val);                                                                                         \
            return env.Undefined();                                                                                     \
        }                                                                                                               \
                                                                                                                        \
        Napi::Value Dequeue(const Napi::CallbackInfo &info) {                                                           \
            Napi::Env env = info.Env();                                                                                 \
            auto val = queue.dequeue();                                                                                 \
            if (!val.has_value()) {                                                                                     \
                Napi::Error::New(env, "Queue is empty").ThrowAsJavaScriptException();                                   \
                return env.Null();                                                                                      \
            }                                                                                                           \
            return JsCreate(env, *val);                                                                                 \
        }                                                                                                               \
                                                                                                                        \
        Napi::Value Front(const Napi::CallbackInfo &info) {                                                             \
            Napi::Env env = info.Env();                                                                                 \
            auto val = queue.front();                                                                                   \
            if (!val.has_value()) {                                                                                     \
                Napi::Error::New(env, "Queue is empty").ThrowAsJavaScriptException();                                   \
                return env.Null();                                                                                      \
            }                                                                                                           \
            return JsCreate(env, *val);                                                                                 \
        }                                                                                                               \
                                                                                                                        \
        Napi::Value Size(const Napi::CallbackInfo &info) {                                                              \
            Napi::Env env = info.Env();                                                                                 \
            return Napi::Number::New(env, queue.size());                                                                \
        }                                                                                                               \
                                                                                                                        \
        Napi::Value Empty(const Napi::CallbackInfo& info) {                                                             \
            Napi::Env env = info.Env();                                                                                 \
            return Napi::Boolean::New(env, queue.isEmpty(false));                                                       \
        }                                                                                                               \
                                                                                                                        \
        Napi::Value IsEmpty(const Napi::CallbackInfo& info) {                                                           \
            Napi::Env env = info.Env();                                                                                 \
            return Napi::Boolean::New(env, queue.isEmpty(true));                                                        \
        }                                                                                                               \
                                                                                                                        \
        Napi::Value GetTrace(const Napi::CallbackInfo& info) {                                                          \
            Napi::Env env = info.Env();                                                                                 \
            std::string json = queue.getExecutionTrace();                                                               \
            return Napi::String::New(env, json);                                                                        \
        }                                                                                                               \
};                                                                                                         

TYPED_QUEUE_WRAPPER(Int, int, IsNumber, As<Napi::Number>().Int32Value, Napi::Number::New)
TYPED_QUEUE_WRAPPER(Double, double, IsNumber, As<Napi::Number>().DoubleValue, Napi::Number::New)
TYPED_QUEUE_WRAPPER(Float, float, IsNumber, As<Napi::Number>().FloatValue, Napi::Number::New)
TYPED_QUEUE_WRAPPER(Bool, bool, IsBoolean, As<Napi::Boolean>().Value, Napi::Boolean::New)
TYPED_QUEUE_WRAPPER(String, std::string, IsString, As<Napi::String>().Utf8Value, Napi::String::New)

Napi::Object QueueModule_Init(Napi::Env env, Napi::Object exports) {
    IntQueueWrapper::Init(env, exports);
    DoubleQueueWrapper::Init(env, exports);
    FloatQueueWrapper::Init(env, exports);
    BoolQueueWrapper::Init(env, exports);
    StringQueueWrapper::Init(env, exports);
    return exports;
}
