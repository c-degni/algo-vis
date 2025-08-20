#include "utils.h"

std::string stringify(const std::string& val) {
    return val;
}

template<typename T>
std::string stringify(const T& val) {
    return std::to_string(val);
}