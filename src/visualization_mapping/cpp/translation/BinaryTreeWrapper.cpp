#include <napi.h>
#include <string>
#include "TrackedBinaryTree.h"

#define TYPED_BINARY_TREE_WRAPPER(TypeName, CppType, JsCheck, JsConvert, JsCreate)                                                  \
class TypeName##BinaryTreeWrapper : public Napi::ObjectWrap<TypeName##BinaryTreeWrapper> {                                          \
    private:                                                                                                                        \
        TrackedBinaryTree<CppType> bt;                                                                                              \
                                                                                                                                    \
    public:                                                                                                                         \
        static Napi::Object Init(Napi::Env env, Napi::Object exports) {                                                             \
            Napi::Function f = DefineClass(env, #TypeName "BinaryTree", {                                                           \
                InstanceMethod("insert", &TypeName##BinaryTreeWrapper::Insert),                                                     \
                InstanceMethod("remove", &TypeName##BinaryTreeWrapper::Remove),                                                     \
                InstanceMethod("find", &TypeName##BinaryTreeWrapper::Find),                                                         \
                InstanceMethod("size", &TypeName##BinaryTreeWrapper::Size),                                                         \
                InstanceMethod("getHeight", &TypeName##BinaryTreeWrapper::GetHeight),                                               \
                InstanceMethod("inorder", &TypeName##BinaryTreeWrapper::Preorder),                                                  \
                InstanceMethod("preorder", &TypeName##BinaryTreeWrapper::Inorder),                                                  \
                InstanceMethod("postorder", &TypeName##BinaryTreeWrapper::Postorder),                                               \
                InstanceMethod("inTree", &TypeName##BinaryTreeWrapper::InTree),                                                     \
                InstanceMethod("getTrace", &TypeName##BinaryTreeWrapper::GetTrace)                                                  \
            });                                                                                                                     \
            exports.Set(#TypeName "BinaryTree", f);                                                                                 \
            return exports;                                                                                                         \
        }                                                                                                                           \
                                                                                                                                    \
        TypeName##BinaryTreeWrapper(const Napi::CallbackInfo &info) : Napi::ObjectWrap<TypeName##BinaryTreeWrapper>(info) {}        \
        ~TypeName##BinaryTreeWrapper() noexcept override = default;                                                                 \
                                                                                                                                    \
        Napi::Value Insert(const Napi::CallbackInfo &info) {                                                                        \
            Napi::Env env = info.Env();                                                                                             \
            if (info.Length() < 1 || !info[0].JsCheck()) {                                                                          \
                Napi::TypeError::New(env, #CppType " expected").ThrowAsJavaScriptException();                                       \
                return env.Null();                                                                                                  \
            }                                                                                                                       \
            CppType val = info[0].JsConvert();                                                                                      \
            bt.insert(val);                                                                                                         \
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
            auto removed = bt.remove(val);                                                                                          \
            if (!removed.has_value()) {                                                                                             \
                Napi::Error::New(env, "Not in binary tree").ThrowAsJavaScriptException();                                           \
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
            auto found = bt.find(val);                                                                                              \
            if (!found.has_value()) {                                                                                               \
                Napi::Error::New(env, "Not in binary tree").ThrowAsJavaScriptException();                                           \
                return env.Null();                                                                                                  \
            }                                                                                                                       \
            return JsCreate(env, *found);                                                                                           \
        }                                                                                                                           \
                                                                                                                                    \
        Napi::Value Size(const Napi::CallbackInfo &info) {                                                                          \
            Napi::Env env = info.Env();                                                                                             \
            return Napi::Number::New(env, bt.size());                                                                               \
        }                                                                                                                           \
                                                                                                                                    \
        Napi::Value GetHeight(const Napi::CallbackInfo &info) {                                                                     \
            Napi::Env env = info.Env();                                                                                             \
            return Napi::Number::New(env, bt.getHeight());                                                                          \
        }                                                                                                                           \
                                                                                                                                    \
        Napi::Value Inorder(const Napi::CallbackInfo& info) {                                                                       \
            Napi::Env env = info.Env();                                                                                             \
            std::string tree = bt.inorder();                                                                                        \
            return Napi::String::New(env, tree);                                                                                    \
        }                                                                                                                           \
                                                                                                                                    \
        Napi::Value Preorder(const Napi::CallbackInfo& info) {                                                                      \
            Napi::Env env = info.Env();                                                                                             \
            std::string tree = bt.preorder();                                                                                       \
            return Napi::String::New(env, tree);                                                                                    \
        }                                                                                                                           \
                                                                                                                                    \
        Napi::Value Postorder(const Napi::CallbackInfo& info) {                                                                     \
            Napi::Env env = info.Env();                                                                                             \
            std::string tree = bt.postorder();                                                                                      \
            return Napi::String::New(env, tree);                                                                                    \
        }                                                                                                                           \
                                                                                                                                    \
        Napi::Value InTree(const Napi::CallbackInfo& info) {                                                                        \
            Napi::Env env = info.Env();                                                                                             \
            if (info.Length() < 1 || !info[0].JsCheck()) {                                                                          \
                Napi::TypeError::New(env, #CppType " expected").ThrowAsJavaScriptException();                                       \
                return env.Null();                                                                                                  \
            }                                                                                                                       \
            CppType val = info[0].JsConvert();                                                                                      \
            return Napi::Boolean::New(env, bt.inTree(val));                                                                         \
        }                                                                                                                           \
                                                                                                                                    \
        Napi::Value GetTrace(const Napi::CallbackInfo& info) {                                                                      \
            Napi::Env env = info.Env();                                                                                             \
            std::string json = bt.getExecutionTrace();                                                                              \
            return Napi::String::New(env, json);                                                                                    \
        }                                                                                                                           \
};                                                                                                         

TYPED_BINARY_TREE_WRAPPER(Int, int, IsNumber, As<Napi::Number>().Int32Value, Napi::Number::New)
TYPED_BINARY_TREE_WRAPPER(Double, double, IsNumber, As<Napi::Number>().DoubleValue, Napi::Number::New)
TYPED_BINARY_TREE_WRAPPER(Float, float, IsNumber, As<Napi::Number>().FloatValue, Napi::Number::New)
TYPED_BINARY_TREE_WRAPPER(Bool, bool, IsBoolean, As<Napi::Boolean>().Value, Napi::Boolean::New)
TYPED_BINARY_TREE_WRAPPER(String, std::string, IsString, As<Napi::String>().Utf8Value, Napi::String::New)

Napi::Object BinaryTreeModule_Init(Napi::Env env, Napi::Object exports) {
    IntBinaryTreeWrapper::Init(env, exports);
    DoubleBinaryTreeWrapper::Init(env, exports);
    FloatBinaryTreeWrapper::Init(env, exports);
    BoolBinaryTreeWrapper::Init(env, exports);
    StringBinaryTreeWrapper::Init(env, exports);
    return exports;
}