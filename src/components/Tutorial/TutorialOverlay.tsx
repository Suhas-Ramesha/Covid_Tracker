import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTutorial } from '../../contexts/TutorialContext';

export function TutorialOverlay() {
  const { isActive, currentStep, steps, nextStep, prevStep, skipTutorial, completeTutorial } = useTutorial();
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);
  const [elementRect, setElementRect] = useState<DOMRect | null>(null);

  const currentStepData = steps[currentStep];

  useEffect(() => {
    if (!isActive || !currentStepData) return;

    const timer = setTimeout(() => {
      const element = document.querySelector(currentStepData.target);
      
      if (element) {
        setHighlightedElement(element);
        const rect = element.getBoundingClientRect();
        setElementRect(rect);
        
        // Scroll element into view
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'center'
        });
      } else {
        setHighlightedElement(null);
        setElementRect(null);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isActive, currentStep, currentStepData]);

  if (!isActive || !currentStepData) return null;

  // Calculate dialog position with guaranteed screen bounds
  const getDialogPosition = () => {
    const dialogWidth = 340;
    const dialogHeight = 300;
    const margin = 20;
    
    // Default center position if no element
    if (!elementRect) {
      return { 
        x: Math.max(margin, (window.innerWidth - dialogWidth) / 2), 
        y: Math.max(margin, (window.innerHeight - dialogHeight) / 2) 
      };
    }

    // Calculate all possible positions
    const positions = {
      right: {
        x: elementRect.right + margin,
        y: elementRect.top + (elementRect.height / 2) - (dialogHeight / 2)
      },
      left: {
        x: elementRect.left - dialogWidth - margin,
        y: elementRect.top + (elementRect.height / 2) - (dialogHeight / 2)
      },
      bottom: {
        x: elementRect.left + (elementRect.width / 2) - (dialogWidth / 2),
        y: elementRect.bottom + margin
      },
      top: {
        x: elementRect.left + (elementRect.width / 2) - (dialogWidth / 2),
        y: elementRect.top - dialogHeight - margin
      }
    };

    // Try preferred position first
    let position = positions[currentStepData.position as keyof typeof positions];
    
    // Check if position is within screen bounds
    const isWithinBounds = (pos: { x: number; y: number }) => {
      return pos.x >= margin && 
             pos.x + dialogWidth <= window.innerWidth - margin &&
             pos.y >= margin && 
             pos.y + dialogHeight <= window.innerHeight - margin;
    };

    // If preferred position doesn't fit, try alternatives in order of preference
    if (!isWithinBounds(position)) {
      const alternatives = ['bottom', 'right', 'left', 'top'];
      
      for (const alt of alternatives) {
        const altPos = positions[alt as keyof typeof positions];
        if (isWithinBounds(altPos)) {
          position = altPos;
          break;
        }
      }
    }

    // Force within bounds as last resort
    position.x = Math.max(margin, Math.min(position.x, window.innerWidth - dialogWidth - margin));
    position.y = Math.max(margin, Math.min(position.y, window.innerHeight - dialogHeight - margin));

    return position;
  };

  const dialogPosition = getDialogPosition();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50">
        {/* Dark overlay with cutout for highlighted element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          style={{
            background: elementRect 
              ? `
                radial-gradient(
                  ellipse ${elementRect.width + 20}px ${elementRect.height + 20}px at ${elementRect.left + elementRect.width/2}px ${elementRect.top + elementRect.height/2}px,
                  transparent 0%,
                  transparent 40%,
                  rgba(0, 0, 0, 0.8) 70%
                )
              `
              : 'rgba(0, 0, 0, 0.8)'
          }}
        />
        
        {/* Highlighted element border */}
        {highlightedElement && elementRect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute pointer-events-none"
            style={{
              left: elementRect.left - 4,
              top: elementRect.top - 4,
              width: elementRect.width + 8,
              height: elementRect.height + 8,
              border: '3px solid #3B82F6',
              borderRadius: '12px',
              boxShadow: `
                0 0 0 1px rgba(59, 130, 246, 0.3),
                0 0 20px rgba(59, 130, 246, 0.4),
                0 0 40px rgba(59, 130, 246, 0.2)
              `,
              zIndex: 51
            }}
          />
        )}
        
        {/* Tutorial dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="absolute bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 pointer-events-auto"
          style={{
            left: `${dialogPosition.x}px`,
            top: `${dialogPosition.y}px`,
            width: '340px',
            maxHeight: 'calc(100vh - 40px)',
            zIndex: 52
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={skipTutorial}
            className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          
          {/* Content */}
          <div className="pr-8">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
              {currentStepData.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-5 leading-relaxed">
              {currentStepData.description}
            </p>
            
            {/* Progress indicator */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex space-x-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentStep 
                        ? 'bg-blue-500 scale-125' 
                        : index < currentStep 
                          ? 'bg-blue-300' 
                          : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                {currentStep + 1} of {steps.length}
              </span>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={skipTutorial}
                  className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  Skip
                </button>
                <button
                  onClick={currentStep === steps.length - 1 ? completeTutorial : nextStep}
                  className="flex items-center px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  {currentStep === steps.length - 1 ? (
                    <>
                      <Play className="h-4 w-4 mr-1" />
                      Start
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}