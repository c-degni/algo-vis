#include "ExecutionTracer.h"

void ExecutionTracer::recordStep(ExecutionStep &step) {
    trace.push_back(step);
}

std::vector<ExecutionStep> ExecutionTracer::getTrace() {
    return trace;
}

std::string ExecutionTracer::getTraceJson() {
    nholmann::json tr = nholmann::json::array();
    for(ExecutionStep &step : tr) {
        trace.push_back(step.toJson);
    }
    return trace.dump();
}