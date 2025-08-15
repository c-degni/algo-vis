#include "ExecutionTracer.h"

void ExecutionTracer::recordStep(ExecutionStep &step) {
    trace.push_back(step);
}

std::vector<ExecutionStep> ExecutionTracer::getTrace() {
    return trace;
}

std::string ExecutionTracer::getTraceJson() {
    nlohmann::json tr = nlohmann::json::array();
    for(ExecutionStep &step : trace) {
        tr.push_back(step.toJson());
    }
    return tr.dump();
}