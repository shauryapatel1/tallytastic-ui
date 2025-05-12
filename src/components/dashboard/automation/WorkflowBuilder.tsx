
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { WorkflowAction, WorkflowAutomation, WorkflowCondition, WorkflowTrigger } from "@/lib/types";
import { Plus, Trash2, Save, ArrowRight } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface WorkflowBuilderProps {
  formId: string;
  onSave?: (workflow: WorkflowAutomation) => void;
}

export function WorkflowBuilder({ formId, onSave }: WorkflowBuilderProps) {
  const [workflow, setWorkflow] = useState<WorkflowAutomation>({
    id: crypto.randomUUID(),
    name: "New Workflow",
    form_id: formId,
    trigger: {
      type: "form_submission",
      config: {}
    },
    conditions: [],
    actions: [
      {
        type: "email",
        config: {
          to: "",
          subject: "New Form Submission",
          template: "default"
        }
      }
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "draft"
  });

  const addCondition = () => {
    setWorkflow({
      ...workflow,
      conditions: [
        ...workflow.conditions,
        { 
          field: "field_name", 
          operator: "equals", 
          value: "" 
        }
      ]
    });
  };

  const updateCondition = (index: number, condition: WorkflowCondition) => {
    const newConditions = [...workflow.conditions];
    newConditions[index] = condition;
    setWorkflow({
      ...workflow,
      conditions: newConditions
    });
  };

  const removeCondition = (index: number) => {
    const newConditions = [...workflow.conditions];
    newConditions.splice(index, 1);
    setWorkflow({
      ...workflow,
      conditions: newConditions
    });
  };

  const addAction = () => {
    setWorkflow({
      ...workflow,
      actions: [
        ...workflow.actions,
        { 
          type: "notification", 
          config: {
            message: "New form submission received"
          } 
        }
      ]
    });
  };

  const updateAction = (index: number, action: WorkflowAction) => {
    const newActions = [...workflow.actions];
    newActions[index] = action;
    setWorkflow({
      ...workflow,
      actions: newActions
    });
  };

  const removeAction = (index: number) => {
    const newActions = [...workflow.actions];
    newActions.splice(index, 1);
    setWorkflow({
      ...workflow,
      actions: newActions
    });
  };

  const updateTrigger = (trigger: WorkflowTrigger) => {
    setWorkflow({
      ...workflow,
      trigger
    });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(workflow);
    }
  };

  const renderTriggerConfig = () => {
    switch (workflow.trigger.type) {
      case 'form_submission':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="all-submissions" 
                checked={workflow.trigger.config.allSubmissions ?? true}
                onCheckedChange={(checked) => updateTrigger({
                  ...workflow.trigger,
                  config: { ...workflow.trigger.config, allSubmissions: checked }
                })}
              />
              <Label htmlFor="all-submissions">Trigger for all submissions</Label>
            </div>
          </div>
        );
      
      case 'scheduled':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schedule-frequency">Frequency</Label>
                <Select
                  value={workflow.trigger.config.frequency || "daily"}
                  onValueChange={(value) => updateTrigger({
                    ...workflow.trigger,
                    config: { ...workflow.trigger.config, frequency: value }
                  })}
                >
                  <SelectTrigger id="schedule-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time-of-day">Time</Label>
                <Input
                  id="time-of-day"
                  type="time"
                  value={workflow.trigger.config.timeOfDay || "09:00"}
                  onChange={(e) => updateTrigger({
                    ...workflow.trigger,
                    config: { ...workflow.trigger.config, timeOfDay: e.target.value }
                  })}
                />
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const renderActionConfig = (action: WorkflowAction, index: number) => {
    switch (action.type) {
      case 'email':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`email-to-${index}`}>Send To</Label>
              <Input 
                id={`email-to-${index}`} 
                value={action.config.to || ""} 
                onChange={(e) => updateAction(index, {
                  ...action,
                  config: { ...action.config, to: e.target.value }
                })}
                placeholder="recipient@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`email-subject-${index}`}>Subject</Label>
              <Input 
                id={`email-subject-${index}`} 
                value={action.config.subject || "New Form Submission"} 
                onChange={(e) => updateAction(index, {
                  ...action,
                  config: { ...action.config, subject: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`email-template-${index}`}>Template</Label>
              <Select
                value={action.config.template || "default"}
                onValueChange={(value) => updateAction(index, {
                  ...action,
                  config: { ...action.config, template: value }
                })}
              >
                <SelectTrigger id={`email-template-${index}`}>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default Template</SelectItem>
                  <SelectItem value="confirmation">Confirmation Template</SelectItem>
                  <SelectItem value="notification">Notification Template</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'notification':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`notification-message-${index}`}>Message</Label>
              <Input 
                id={`notification-message-${index}`} 
                value={action.config.message || ""} 
                onChange={(e) => updateAction(index, {
                  ...action,
                  config: { ...action.config, message: e.target.value }
                })}
              />
            </div>
          </div>
        );
        
      case 'api_call':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`api-url-${index}`}>API URL</Label>
              <Input 
                id={`api-url-${index}`} 
                value={action.config.url || ""} 
                onChange={(e) => updateAction(index, {
                  ...action,
                  config: { ...action.config, url: e.target.value }
                })}
                placeholder="https://api.example.com/webhook"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`api-method-${index}`}>Method</Label>
              <Select
                value={action.config.method || "POST"}
                onValueChange={(value) => updateAction(index, {
                  ...action,
                  config: { ...action.config, method: value }
                })}
              >
                <SelectTrigger id={`api-method-${index}`}>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Workflow Automation</CardTitle>
        <CardDescription>
          Create automated workflows for your form submissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workflow-name">Workflow Name</Label>
            <Input 
              id="workflow-name"
              value={workflow.name} 
              onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })} 
            />
          </div>
          
          <div>
            <Label className="mb-2 block">Status</Label>
            <div className="flex items-center space-x-2">
              <Switch 
                id="workflow-status" 
                checked={workflow.status === "active"}
                onCheckedChange={(checked) => setWorkflow({ 
                  ...workflow, 
                  status: checked ? "active" : "draft" 
                })}
              />
              <Label htmlFor="workflow-status">
                {workflow.status === "active" ? "Active" : "Draft"}
              </Label>
            </div>
          </div>
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="trigger">
            <AccordionTrigger className="font-medium">Trigger</AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trigger-type">Trigger Type</Label>
                <Select
                  value={workflow.trigger.type}
                  onValueChange={(value: "form_submission" | "scheduled" | "api_call") => updateTrigger({
                    type: value,
                    config: {}
                  })}
                >
                  <SelectTrigger id="trigger-type">
                    <SelectValue placeholder="Select trigger type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="form_submission">Form Submission</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="api_call">API Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {renderTriggerConfig()}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="conditions">
            <AccordionTrigger className="font-medium">
              Conditions ({workflow.conditions.length})
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              {workflow.conditions.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No conditions set. This workflow will run for all triggers.
                </div>
              ) : (
                workflow.conditions.map((condition, index) => (
                  <Card key={index} className="border border-gray-200">
                    <CardContent className="pt-4 pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Condition {index + 1}</h4>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeCondition(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Select
                            value={condition.field}
                            onValueChange={(value) => updateCondition(index, {
                              ...condition,
                              field: value
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Field" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="field_name">Field Name</SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="name">Name</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Select
                            value={condition.operator}
                            onValueChange={(value: any) => updateCondition(index, {
                              ...condition,
                              operator: value
                            })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Operator" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="equals">Equals</SelectItem>
                              <SelectItem value="notEquals">Not Equals</SelectItem>
                              <SelectItem value="contains">Contains</SelectItem>
                              <SelectItem value="greaterThan">Greater Than</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Input 
                            value={condition.value as string}
                            onChange={(e) => updateCondition(index, {
                              ...condition,
                              value: e.target.value
                            })}
                            placeholder="Value"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
              
              <Button variant="outline" className="w-full" onClick={addCondition}>
                <Plus className="h-4 w-4 mr-2" />
                Add Condition
              </Button>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="actions">
            <AccordionTrigger className="font-medium">
              Actions ({workflow.actions.length})
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="space-y-4">
                {workflow.actions.map((action, index) => (
                  <Card key={index} className="border border-gray-200">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">Action {index + 1}</h4>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeAction(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Action Type</Label>
                        <Select
                          value={action.type}
                          onValueChange={(value: any) => updateAction(index, {
                            type: value,
                            config: {}
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select action type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="email">Send Email</SelectItem>
                            <SelectItem value="notification">Send Notification</SelectItem>
                            <SelectItem value="api_call">API Call</SelectItem>
                            <SelectItem value="update_data">Update Data</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {renderActionConfig(action, index)}
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <Button variant="outline" className="w-full" onClick={addAction}>
                <Plus className="h-4 w-4 mr-2" />
                Add Action
              </Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="bg-gray-50 rounded-md p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-gray-200">
              {workflow.trigger.type === "form_submission" ? (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8 11L11 14L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8L12 12L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <ArrowRight className="h-5 w-5 mx-2 text-gray-400" />
            {workflow.conditions.length > 0 && (
              <>
                <div className="p-2 rounded-full bg-gray-200">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V20M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <ArrowRight className="h-5 w-5 mx-2 text-gray-400" />
              </>
            )}
            <div className="p-2 rounded-full bg-gray-200">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M4 9L12 13L20 9" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            When a {workflow.trigger.type.replace('_', ' ')} occurs
            {workflow.conditions.length > 0 ? ', if conditions are met,' : ''}
            , then {workflow.actions.length} action{workflow.actions.length !== 1 ? 's' : ''} will be performed.
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Workflow
        </Button>
      </CardFooter>
    </Card>
  );
}
