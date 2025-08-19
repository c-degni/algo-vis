#include <string>

// In case val is already a string, compiler will choose proper overload
std::string stringify(const std::string& val);

template<typename T>
std::string stringify(const T& val);