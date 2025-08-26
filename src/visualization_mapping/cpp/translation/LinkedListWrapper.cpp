#include <napi.h>
#include <string>
#include "TrackedLinkedList.h"

#define TYPED_LINKED_LIST_WRAPPER(TypeName, CppType, JsCheck, JsConvert, JsCreate)                                                  \
class TypeName##LinkedListWrapper : public Napi::ObjectWrap<TypeName##LinkedListWrapper> {                                          \
    private:                                                                                                                        \
        TrackedLinkedList<CppType> ll;                                                                                              \
                                                                                                                                    \
    public:                                                                                                                         \
        static Napi::Object Init(Napi::Env env, Napi::Object exports) {                                                             \
            Napi::Function f = DefineClass(env, #TypeName "LinkedList", {                                                           \
                InstanceMethod("insert", &TypeName##LinkedListWrapper::Insert),                                                     \
                InstanceMethod("remove", &TypeName##LinkedListWrapper::Remove),                                                     \
                InstanceMethod("find", &TypeName##LinkedListWrapper::Find),                                                         \
                InstanceMethod("size", &TypeName##LinkedListWrapper::Size),                                                         \
                InstanceMethod("getTrace", &TypeName##LinkedListWrapper::GetTrace)                                                  \
            });                                                                                                                     \
            exports.Set(#TypeName "LinkedList", f);                                                                                 \
            return exports;                                                                                                         \
        }                                                                                                                           \
                                                                                                                                    \
        TypeName##LinkedListWrapper(const Napi::CallbackInfo &info) : Napi::ObjectWrap<TypeName##LinkedListWrapper>(info) {}        \
        ~TypeName##LinkedListWrapper() noexcept override = default;                                                                 \
                                                                                                                                    \
        Napi::Value Insert(const Napi::CallbackInfo &info) {                                                                        \
            Napi::Env env = info.Env();                                                                                             \
            if (info.Length() < 1 || !info[0].JsCheck()) {                                                                          \
                Napi::TypeError::New(env, #CppType " expected").ThrowAsJavaScriptException();                                       \
                return env.Null();                                                                                                  \
            }                                                                                                                       \
            CppType val = info[0].JsConvert();                                                                                      \
            ll.insert(val);                                                                                                         \
            return env.Undefined();                                                                                                 \
        }                                                                                                                           \
                                                                                                                                    \
        Napi::Value Remove(const Napi::CallbackInfo &info) {                                                                        \
            Napi::Env env = info.Env();                                                                                             \
            if (info.Length() < 1 || !info[0].JsCheck()) {                                                                          \
                Napi::TypeError::New(env, #CppType " expected").ThrowAsJavaScriptException();                                       \
                return env.Null();                                                                                                  \
            }                                                                                                                       \
            CppType val = info[0].JsConvert();                                                                                      \
            auto removed = ll.remove(val);                                                                                          \
            if (!removed.has_value()) {                                                                                             \
                Napi::Error::New(env, "Linked list is empty").ThrowAsJavaScriptException();                                         \
                return env.Null();                                                                                                  \
            }                                                                                                                       \
            return JsCreate(env, *removed);                                                                                         \
        }                                                                                                                           \
                                                                                                                                    \
        Napi::Value Find(const Napi::CallbackInfo &info) {                                                                          \
            Napi::Env env = info.Env();                                                                                             \
            if (info.Length() < 1 || !info[0].JsCheck()) {                                                                          \
                Napi::TypeError::New(env, #CppType " expected").ThrowAsJavaScriptException();                                       \
                return env.Null();                                                                                                  \
            }                                                                                                                       \
            CppType val = info[0].JsConvert();                                                                                      \
            auto found = ll.find(val);                                                                                              \
            if (!found.has_value()) {                                                                                               \
                Napi::Error::New(env, "Not in linked list").ThrowAsJavaScriptException();                                 \
                return env.Null();                                                                                                  \
            }                                                                                                                       \
            return JsCreate(env, *found);                                                                                           \
        }                                                                                                                           \
                                                                                                                                    \
        Napi::Value Size(const Napi::CallbackInfo &info) {                                                                          \
            Napi::Env env = info.Env();                                                                                             \
            return Napi::Number::New(env, ll.size());                                                                               \
        }                                                                                                                           \
                                                                                                                                    \
        Napi::Value GetTrace(const Napi::CallbackInfo& info) {                                                                      \
            Napi::Env env = info.Env();                                                                                             \
            std::string json = ll.getExecutionTrace();                                                                              \
            return Napi::String::New(env, json);                                                                                    \
        }                                                                                                                           \
};                                                                                                         

TYPED_LINKED_LIST_WRAPPER(Int, int, IsNumber, As<Napi::Number>().Int32Value, Napi::Number::New)
TYPED_LINKED_LIST_WRAPPER(Double, double, IsNumber, As<Napi::Number>().DoubleValue, Napi::Number::New)
TYPED_LINKED_LIST_WRAPPER(Float, float, IsNumber, As<Napi::Number>().FloatValue, Napi::Number::New)
TYPED_LINKED_LIST_WRAPPER(Bool, bool, IsBoolean, As<Napi::Boolean>().Value, Napi::Boolean::New)
TYPED_LINKED_LIST_WRAPPER(String, std::string, IsString, As<Napi::String>().Utf8Value, Napi::String::New)

Napi::Object LinkedListModule_Init(Napi::Env env, Napi::Object exports) {
    IntLinkedListWrapper::Init(env, exports);
    DoubleLinkedListWrapper::Init(env, exports);
    FloatLinkedListWrapper::Init(env, exports);
    BoolLinkedListWrapper::Init(env, exports);
    StringLinkedListWrapper::Init(env, exports);
    return exports;
}