#ifndef EXECUTION_TRACER_H
#define EXECUTION_TRACER_H

#include <vector>
#include <string>
#include <chrono>
#include "json.hpp"

struct ExecutionStep {
    std::string operation;
    std::string description;
    nlohmann::json state_snapshot;
    std::chrono::high_resolution_clock::time_point timestamp;
    std::vector<int> highlights;

    nlohmann::json toJson() {
        return {
            {"operation", operation},
            {"description", description},
            {"state", state_snapshot},
            {"timestamp", std::chrono::duration_cast<std::chrono::milliseconds>(
                timestamp.time_since_epoch()).count()},
            {"highlights", highlights}
        };
    }
};

class ExecutionTracer {
    private:
        std::vector<ExecutionStep> trace;

    public:
        void recordStep(ExecutionStep &step);
        std::vector<ExecutionStep> getTrace();
        std::string getTraceJson();
};

#endif