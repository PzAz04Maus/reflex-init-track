import type { WeatherComplicationResolution, WeatherComplicationType, WeatherForecastResolution } from './types';

export function getWeatherForecastResolution(
	marginOfSuccess: number,
	method: WeatherForecastResolution['method'] = 'fieldcraft',
): WeatherForecastResolution {
	const forecastDays = marginOfSuccess >= 10 ? 3 : marginOfSuccess >= 5 ? 2 : marginOfSuccess >= 0 ? 1 : 0;

	return {
		forecastDays,
		method,
		notes: forecastDays > 0
			? [`A successful ${method} forecast predicts general weather for ${forecastDays} day(s).`]
			: [`The ${method} forecast fails to produce a reliable prediction.`],
	};
}

export function getWeatherComplicationResolution(
	type: WeatherComplicationType,
	basePenalty: -1 | -2 | -3,
	mitigation = 0,
): WeatherComplicationResolution {
	const penalty = Math.min(0, basePenalty + Math.max(0, mitigation));
	const maintenanceUseLevelIncrease = penalty < 0;

	return {
		type,
		penalty,
		maintenanceUseLevelIncrease,
		notes: [
			...(type === 'water' ? ['Moisture promotes rust, mold, and contamination of fuel or lubricants.'] : []),
			...(type === 'particulates' ? ['Dust, ash, and sand foul moving parts and contaminate lubricants and fuel.'] : []),
			...(type === 'salt' ? ['Salt accelerates corrosion and can break down lubricants and ammunition propellant.'] : []),
			...(mitigation > 0 ? ['Protective clothing or shelter reduces or eliminates the penalty.'] : []),
		],
	};
}