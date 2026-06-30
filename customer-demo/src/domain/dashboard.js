const emptyMetrics = {
  totalTurbines: 0,
  runningTurbines: 0,
  stoppedTurbines: 0,
  availabilityRate: 0,
  downtimeLossMwh: 0,
  openWorkOrders: 0,
  overdueWorkOrders: 0,
  sparePartCost: 0,
};

export function filterScopeOptions(data) {
  const options = [{ level: "group", id: data.group.id, label: data.group.name }];

  for (const region of data.regions) {
    options.push({ level: "region", id: region.id, label: region.name });
  }

  for (const region of data.regions) {
    for (const project of region.projects) {
      options.push({ level: "project", id: project.id, label: project.name });
    }
  }

  for (const windFarm of collectWindFarms(data)) {
    options.push({ level: "windFarm", id: windFarm.id, label: windFarm.name });
  }

  return options;
}

export function buildDashboardSummary(data, scope) {
  const windFarms = selectWindFarms(data, scope);
  const totals = windFarms.reduce(
    (summary, windFarm) => addMetrics(summary, windFarm.metrics),
    { ...emptyMetrics },
  );

  return {
    ...totals,
    availabilityRate: weightedAverage(
      windFarms.map((windFarm) => ({
        value: windFarm.metrics.availabilityRate,
        weight: windFarm.metrics.totalTurbines,
      })),
    ),
    highFrequencyFaults: data.highFrequencyFaults,
    problemTurbines: data.problemTurbines,
    urgentWorkOrders: data.urgentWorkOrders,
  };
}

function selectWindFarms(data, scope) {
  if (scope.level === "group") return collectWindFarms(data);

  for (const region of data.regions) {
    if (scope.level === "region" && region.id === scope.id) {
      return region.projects.flatMap((project) => project.windFarms);
    }

    for (const project of region.projects) {
      if (scope.level === "project" && project.id === scope.id) {
        return project.windFarms;
      }

      const windFarm = project.windFarms.find((item) => item.id === scope.id);
      if (scope.level === "windFarm" && windFarm) {
        return [windFarm];
      }
    }
  }

  return [];
}

function collectWindFarms(data) {
  return data.regions.flatMap((region) =>
    region.projects.flatMap((project) => project.windFarms),
  );
}

function addMetrics(left, right) {
  return {
    totalTurbines: left.totalTurbines + right.totalTurbines,
    runningTurbines: left.runningTurbines + right.runningTurbines,
    stoppedTurbines: left.stoppedTurbines + right.stoppedTurbines,
    availabilityRate: 0,
    downtimeLossMwh: round(left.downtimeLossMwh + right.downtimeLossMwh),
    openWorkOrders: left.openWorkOrders + right.openWorkOrders,
    overdueWorkOrders: left.overdueWorkOrders + right.overdueWorkOrders,
    sparePartCost: left.sparePartCost + right.sparePartCost,
  };
}

function weightedAverage(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight === 0) return 0;

  const value = items.reduce((sum, item) => sum + item.value * item.weight, 0);
  return round(value / totalWeight);
}

function round(value) {
  return Math.round(value * 10) / 10;
}
