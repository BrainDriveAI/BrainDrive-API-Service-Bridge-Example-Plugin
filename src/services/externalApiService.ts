/**
 * External API Service for ServiceExample_API plugin
 * 
 * This service handles external API connectivity testing,
 * specifically for checking if https://community.braindrive.ai/ is accessible.
 */

import { ApiCheckResult } from '../types/api';
import { OperationResult } from '../types/demo';

export class ExternalApiService {
  private readonly targetUrl = 'https://community.braindrive.ai/';
  private checkCount = 0;

  constructor() {
    console.log('[API-DEMO] 📚 LEARNING: ExternalApiService initialized for connectivity testing');
  }

  /**
   * Check if the community site is accessible
   */
  async checkCommunityStatus(): Promise<OperationResult<ApiCheckResult>> {
    const startTime = Date.now();
    this.checkCount++;
    const checkId = `check-${this.checkCount}`;

    console.group(`[API-DEMO] 🌐 External API Check #${this.checkCount}`);
    console.log('Target URL:', this.targetUrl);
    console.log('Check ID:', checkId);
    console.log('📚 LEARNING: Testing external API connectivity without authentication');
    console.groupEnd();

    try {
      // Use fetch with a timeout to check connectivity
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(this.targetUrl, {
        method: 'HEAD', // Use HEAD to minimize data transfer
        mode: 'no-cors', // Handle CORS restrictions
        cache: 'no-cache',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // With no-cors mode, we can't access the actual status
      // but if the request completes without error, the site is likely accessible
      const result: ApiCheckResult = {
        url: this.targetUrl,
        status: 'online',
        responseTime,
        timestamp: new Date().toISOString(),
        statusCode: response.status || null,
        error: null
      };

      console.group(`[API-DEMO] ✅ External API Check #${this.checkCount} - Success`);
      console.log('Status: Online');
      console.log('Response Time:', `${responseTime}ms`);
      console.log('📚 LEARNING: External API is accessible');
      console.groupEnd();

      return {
        success: true,
        data: result,
        timing: {
          startTime,
          endTime,
          duration: responseTime
        }
      };

    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      let status: 'offline' | 'error' = 'offline';
      let errorMessage = 'Unknown error';

      if (error instanceof Error) {
        errorMessage = error.message;
        
        if (error.name === 'AbortError') {
          status = 'error';
          errorMessage = 'Request timeout after 10 seconds';
        } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
          status = 'offline';
          errorMessage = 'Network error - site may be down or unreachable';
        }
      }

      const result: ApiCheckResult = {
        url: this.targetUrl,
        status,
        responseTime,
        timestamp: new Date().toISOString(),
        statusCode: null,
        error: errorMessage
      };

      console.group(`[API-DEMO] ❌ External API Check #${this.checkCount} - Failed`);
      console.log('Status:', status);
      console.log('Error:', errorMessage);
      console.log('Response Time:', `${responseTime}ms`);
      console.log('📚 LEARNING: External API connectivity issue detected');
      console.groupEnd();

      return {
        success: false,
        data: result,
        error: errorMessage,
        timing: {
          startTime,
          endTime,
          duration: responseTime
        }
      };
    }
  }

  /**
   * Perform multiple connectivity checks with intervals
   */
  async performMultipleChecks(count: number = 3, intervalMs: number = 2000): Promise<OperationResult<ApiCheckResult[]>> {
    const results: ApiCheckResult[] = [];
    const startTime = Date.now();

    console.log(`[API-DEMO] 📚 LEARNING: Performing ${count} connectivity checks with ${intervalMs}ms intervals`);

    try {
      for (let i = 0; i < count; i++) {
        if (i > 0) {
          // Wait between checks
          await new Promise(resolve => setTimeout(resolve, intervalMs));
        }

        const checkResult = await this.checkCommunityStatus();
        if (checkResult.data) {
          results.push(checkResult.data);
        }
      }

      const endTime = Date.now();
      const onlineCount = results.filter(r => r.status === 'online').length;
      const avgResponseTime = results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / results.length;

      console.group('[API-DEMO] 📊 Multiple Checks Summary');
      console.log(`Total Checks: ${results.length}`);
      console.log(`Online: ${onlineCount}/${results.length}`);
      console.log(`Average Response Time: ${avgResponseTime.toFixed(0)}ms`);
      console.log('📚 LEARNING: Multiple checks provide reliability assessment');
      console.groupEnd();

      return {
        success: true,
        data: results,
        timing: {
          startTime,
          endTime,
          duration: endTime - startTime
        }
      };

    } catch (error) {
      const endTime = Date.now();
      console.error('[API-DEMO] ❌ Multiple checks failed:', error);

      return {
        success: false,
        data: results, // Return partial results
        error: error instanceof Error ? error.message : 'Multiple checks failed',
        timing: {
          startTime,
          endTime,
          duration: endTime - startTime
        }
      };
    }
  }

  /**
   * Get service statistics
   */
  getStats(): { checkCount: number; targetUrl: string } {
    return {
      checkCount: this.checkCount,
      targetUrl: this.targetUrl
    };
  }

  /**
   * Reset check counter (useful for testing)
   */
  resetStats(): void {
    this.checkCount = 0;
    console.log('[API-DEMO] 📚 LEARNING: External API service stats reset');
  }

  /**
   * Validate URL format (utility method)
   */
  static isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get connectivity status description
   */
  static getStatusDescription(status: string): string {
    switch (status) {
      case 'online':
        return 'Site is accessible and responding';
      case 'offline':
        return 'Site is not accessible or not responding';
      case 'error':
        return 'Error occurred during connectivity test';
      case 'checking':
        return 'Connectivity check in progress';
      default:
        return 'Unknown connectivity status';
    }
  }

  /**
   * Format response time for display
   */
  static formatResponseTime(responseTime: number | null): string {
    if (responseTime === null) {
      return 'N/A';
    }
    
    if (responseTime < 1000) {
      return `${responseTime}ms`;
    } else {
      return `${(responseTime / 1000).toFixed(1)}s`;
    }
  }
}

// Export singleton instance
export const externalApiService = new ExternalApiService();